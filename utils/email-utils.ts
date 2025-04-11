import { Creator } from '@/types/creators';
import { Email } from '@/lib/types/emails';
import { format, isToday, isYesterday, isThisWeek, isThisYear } from 'date-fns';

// Helper function for consistent date formatting
const padZero = (num: number): string => {
  return num.toString().padStart(2, '0');
};

export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  
  // Use consistent formatting that doesn't depend on locale
  const hours = date.getHours();
  const minutes = padZero(date.getMinutes());
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 || 12; // Convert 0 to 12 for 12-hour format
  
  // If it's today, show the time
  if (isToday(date)) {
    return `${displayHours}:${minutes} ${ampm}`;
  }
  
  // If it's yesterday, show "Yesterday"
  if (isYesterday(date)) {
    return `Yesterday`;
  }
  
  // If it's this week, show the day name
  if (isThisWeek(date, { weekStartsOn: 1 })) {
    return format(date, 'EEEE'); // Monday, Tuesday, etc.
  }
  
  // If it's this year, show the month and day
  if (isThisYear(date)) {
    return format(date, 'MMM d'); // Jan 5, Feb 12, etc.
  }
  
  // Otherwise show the full date
  return format(date, 'MMM d, yyyy');
};

// Format date for detailed view
export const formatDetailedDate = (dateString: string) => {
  try {
    const date = new Date(dateString);
    
    if (isToday(date)) {
      return `Today at ${format(date, 'h:mm a')}`;
    }
    
    if (isYesterday(date)) {
      return `Yesterday at ${format(date, 'h:mm a')}`;
    }
    
    if (isThisWeek(date, { weekStartsOn: 1 })) {
      return format(date, 'EEEE') + ' at ' + format(date, 'h:mm a');
    }
    
    return format(date, 'EEE, MMM d, yyyy h:mm a');
  } catch (error) {
    return dateString;
  }
};

export const getCategoryLabel = (category: string) => {
  switch (category) {
    case 'brand_deal':
      return 'Brand Deal';
    case 'pr':
      return 'PR / Gifting';
    case 'invoicing':
      return 'Invoicing';
    default:
      return 'Other';
  }
};

export const getCategoryColor = (category: string) => {
  switch (category) {
    case 'brand_deal':
      return 'bg-blue-100 text-blue-800';
    case 'pr':
      return 'bg-purple-100 text-purple-800';
    case 'invoicing':
      return 'bg-green-100 text-green-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export const generateMockEmails = (creators: Creator[]): Email[] => {
  // Generate some mock emails for wireframing purposes
  const mockEmails: Email[] = [];

  const categories = ['brand_deal', 'pr', 'invoicing', 'other'] as const;
  const subjects = [
    'Collaboration opportunity',
    'New campaign request',
    'Invoice for recent work',
    'Follow-up on our conversation',
    'Partnership proposal',
    'Content review request',
  ];

  // Generate 20 mock emails
  for (let i = 0; i < 20; i++) {
    const randomCreator =
      creators[Math.floor(Math.random() * creators.length)];
    const category =
      categories[Math.floor(Math.random() * categories.length)];
    const subject = subjects[Math.floor(Math.random() * subjects.length)];
    const threadId = `thread-${Math.floor(i / 3)}`; // Group emails into threads

    mockEmails.push({
      id: `email-${i}`,
      subject,
      sender: randomCreator
        ? `Brand for ${randomCreator.name}`
        : 'Brand Agency',
      senderEmail: 'brand@example.com',
      preview:
        'Hi there, I wanted to reach out about a potential collaboration opportunity...',
      body: 'Hi there,\n\nI wanted to reach out about a potential collaboration opportunity. We think your content would be a great fit for our brand.\n\nLet me know if you\'re interested in discussing further.\n\nBest regards,\nBrand Manager',
      date: new Date(
        Date.now() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000)
      ).toISOString(),
      isRead: Math.random() > 0.3,
      isStarred: Math.random() > 0.7,
      category,
      creatorId: randomCreator?.id,
      threadId,
      threadSize: 3,
      hasAttachments: Math.random() > 0.7,
    });
  }

  return mockEmails.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}; 