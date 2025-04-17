import {
  format,
  isToday,
  isYesterday,
  differenceInDays,
  differenceInMonths,
} from "date-fns";

interface Conversation {
  conversation_id: string;
  timestamp: string; // Assuming the timestamp is a string in ISO format
  latest_message: string;
  folder_color: string | null;
  folder_id: number | null;
  folder_name: string | null;
}

interface GroupedConversations {
  today: Conversation[];
  yesterday: Conversation[];
  last7Days: Conversation[];
  thisMonth: Conversation[];
  older: Conversation[];
}

export const groupConversationsByTime = (
  conversations: Conversation[]
): GroupedConversations => {
  const groupedConversations: GroupedConversations = {
    today: [],
    yesterday: [],
    last7Days: [],
    thisMonth: [],
    older: [],
  };

  conversations?.forEach((item) => {
    const conversationDate = new Date(item.timestamp);

    if (isToday(conversationDate)) {
      groupedConversations.today.push(item);
    } else if (isYesterday(conversationDate)) {
      groupedConversations.yesterday.push(item);
    } else if (differenceInDays(new Date(), conversationDate) <= 7) {
      groupedConversations.last7Days.push(item);
    } else if (differenceInMonths(new Date(), conversationDate) === 0) {
      groupedConversations.thisMonth.push(item);
    } else {
      groupedConversations.older.push(item);
    }
  });

  return groupedConversations;
};
