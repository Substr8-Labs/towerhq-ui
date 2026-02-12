import { NextApiRequest } from "next";
import { NextApiResponseServerIo } from "@/types/server";
import { getCurrentProfilePage } from "@/lib/query";
import { prisma } from "@/lib/prismadb";
import { getPersonaForChannel, getAIResponse, PERSONAS } from "@/lib/openclaw";

// Get or create a bot member for an AI persona
async function getOrCreateBotMember(serverId: string, personaId: string) {
  const persona = PERSONAS[personaId];
  if (!persona) return null;

  // Use a deterministic ID for bot profiles based on persona
  const botUserId = `bot_${personaId}`;
  
  // Find or create the bot profile
  let botProfile = await prisma.profile.findUnique({
    where: { userId: botUserId },
  });

  if (!botProfile) {
    botProfile = await prisma.profile.create({
      data: {
        userId: botUserId,
        name: persona.name,
        email: `${personaId}@towerhq.ai`,
        imageUrl: null, // Could add avatar URLs later
      },
    });
  }

  // Find or create the bot member for this server
  let botMember = await prisma.member.findFirst({
    where: {
      profileId: botProfile.id,
      serverId: serverId,
    },
  });

  if (!botMember) {
    botMember = await prisma.member.create({
      data: {
        profileId: botProfile.id,
        serverId: serverId,
        role: 'MODERATOR', // Bots get moderator role
      },
    });
  }

  return {
    member: botMember,
    profile: botProfile,
  };
}

export default async function handler(req: NextApiRequest, res: NextApiResponseServerIo) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const profile = await getCurrentProfilePage(req);
    const { fileUrl, content } = req.body;
    const { channelId, serverId } = req.query;

    if (!profile) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    if (!serverId || !channelId) {
      return res.status(400).json({ message: "ServerId and channelId are required" });
    }
    if (!content) {
      return res.status(400).json({ message: "Content is required" });
    }

    const server = await prisma.server.findFirst({
      where: {
        id: serverId as string,
        members: {
          some: {
            profileId: profile.id,
          },
        },
      },
      include: {
        members: true,
      },
    });

    if (!server) {
      return res.status(404).json({ message: "Server not found" });
    }

    const channel = await prisma.channel.findFirst({
      where: {
        id: channelId as string,
        serverId: serverId as string,
      },
    });

    if (!channel) {
      return res.status(404).json({ message: "Channel not found" });
    }

    const member = server.members.find((m) => m.profileId === profile.id);
    if (!member) {
      return res.status(404).json({ message: "Member not found" });
    }

    // Create the user's message
    const message = await prisma.message.create({
      data: {
        content,
        fileUrl,
        memberId: member.id,
        channelId: channel.id as string,
      },
      include: {
        member: {
          include: {
            profile: true,
          },
        },
      },
    });

    const channelKey = `chat:${channel.id}:messages`;
    res?.socket?.server?.io?.emit(channelKey, message);

    // Check if this channel should trigger AI response
    const persona = getPersonaForChannel(channel.name);
    
    if (persona) {
      // Get AI response asynchronously (don't block the user message response)
      setImmediate(async () => {
        try {
          const aiResponse = await getAIResponse(
            content,
            persona,
            serverId as string,
            channelId as string
          );

          if (aiResponse.success && aiResponse.response) {
            // Get or create bot member
            const bot = await getOrCreateBotMember(serverId as string, persona.id);
            
            if (bot) {
              // Create AI response message
              const aiMessage = await prisma.message.create({
                data: {
                  content: aiResponse.response,
                  memberId: bot.member.id,
                  channelId: channel.id as string,
                },
                include: {
                  member: {
                    include: {
                      profile: true,
                    },
                  },
                },
              });

              // Emit AI response to channel
              res?.socket?.server?.io?.emit(channelKey, aiMessage);
            }
          }
        } catch (error) {
          console.error('AI response error:', error);
        }
      });
    }

    return res.status(201).json(message);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
