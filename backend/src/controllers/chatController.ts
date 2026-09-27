import { Response } from 'express';
import { prisma } from '../utils/prisma';
import { AuthRequest } from '../middleware/authMiddleware';

const HEALTH_RESPONSES: Record<string, string> = {
  fever: "Fever is often a natural sign that your body is fighting an infection. Stay hydrated with plenty of fluids, rest adequately, and monitor your temperature. If fever exceeds 102°F (38.9°C), persists for more than 3 days, or is accompanied by severe headache, chest pain, or difficulty breathing, please seek immediate medical evaluation.",
  diabetes: "Common symptoms of diabetes include increased thirst (polydipsia), frequent urination (polyuria), unexplained weight loss, blurred vision, and persistent fatigue. Regular blood glucose screening and consulting a medical specialist are recommended if you observe these signs.",
  eye: "To maintain optimal eye health: 1) Schedule comprehensive annual eye exams. 2) Manage blood sugar and blood pressure levels. 3) Wear UV-blocking sunglasses outdoors. 4) Practice the 20-20-20 rule during screen use. 5) Avoid rubbing your eyes and maintain good hygiene.",
  vision: "Sudden vision changes, such as sudden blurring, dark spots, flashers, or loss of sight, are medical emergencies that require immediate evaluation by an ophthalmologist or emergency physician. Do not delay seeking urgent care."
};

function generateAIResponse(userPrompt: string, lang: string): string {
  const lower = userPrompt.toLowerCase();

  let text = "Thank you for asking Netra AI. I am an AI healthcare assistant designed to provide general wellness guidance. I cannot diagnose or treat medical conditions. Please consult a qualified doctor for personalized medical care.";

  if (lower.includes('fever') || lower.includes('temperature') || lower.includes('bukhar') || lower.includes('ताव')) {
    text = HEALTH_RESPONSES.fever;
  } else if (lower.includes('diabetes') || lower.includes('sugar') || lower.includes('मधुमेह')) {
    text = HEALTH_RESPONSES.diabetes;
  } else if (lower.includes('eye') || lower.includes('vision') || lower.includes('retina') || lower.includes('आंख') || lower.includes('दृष्टि')) {
    text = HEALTH_RESPONSES.eye;
  } else if (lower.includes('sudden') || lower.includes('pain') || lower.includes('emergency') || lower.includes('urgent')) {
    text = HEALTH_RESPONSES.vision;
  } else {
    text = `Thank you for your inquiry about "${userPrompt}". For any health concerns, maintaining balanced nutrition, staying physically active, getting 7-8 hours of sleep, and undergoing routine health check-ups are key. If you have specific symptoms, please share them with a healthcare professional.`;
  }

  // Language customization notice if applicable
  if (lang === 'hi') {
    text = `[Hindi Response] ${text} (कृपया किसी योग्य चिकित्सक से परामर्श लें।)`;
  } else if (lang === 'gu') {
    text = `[Gujarati Response] ${text} (કૃપા કરીને લાયક તબીબી વ્યાવસાયિકની સલાહ લો.)`;
  }

  return text;
}

export const postChatMessage = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized', code: 'UNAUTHORIZED' });
    }

    const { message, sessionId, language } = req.body;
    if (!message) {
      return res.status(400).json({ success: false, message: 'Message text is required', code: 'VALIDATION_ERROR' });
    }

    const lang = language || 'en';

    // Get or create session
    let session;
    if (sessionId) {
      session = await prisma.chatSession.findUnique({ where: { id: sessionId } });
    }

    if (!session) {
      session = await prisma.chatSession.create({
        data: {
          userId,
          title: message.slice(0, 30) + '...'
        }
      });
    }

    // Save user message
    await prisma.chatMessage.create({
      data: {
        sessionId: session.id,
        sender: 'user',
        text: message,
        language: lang
      }
    });

    // Generate AI response
    const assistantReply = generateAIResponse(message, lang);

    const botMessage = await prisma.chatMessage.create({
      data: {
        sessionId: session.id,
        sender: 'assistant',
        text: assistantReply,
        language: lang
      }
    });

    res.json({
      success: true,
      sessionId: session.id,
      reply: botMessage
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message, code: 'CHAT_FAILED' });
  }
};

export const getChatSessions = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized', code: 'UNAUTHORIZED' });
    }

    const sessions = await prisma.chatSession.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' }
        }
      }
    });

    res.json({ success: true, sessions });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message, code: 'FETCH_SESSIONS_FAILED' });
  }
};

export const getChatSessionById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const session = await prisma.chatSession.findUnique({
      where: { id },
      include: {
        messages: { orderBy: { createdAt: 'asc' } }
      }
    });

    if (!session) {
      return res.status(404).json({ success: false, message: 'Chat session not found', code: 'SESSION_NOT_FOUND' });
    }

    res.json({ success: true, session });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message, code: 'FETCH_SESSION_FAILED' });
  }
};

export const deleteChatSession = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.chatSession.delete({ where: { id } });
    res.json({ success: true, message: 'Session deleted successfully' });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message, code: 'DELETE_SESSION_FAILED' });
  }
};
