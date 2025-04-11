import { getValidAccessToken } from './auth';

/**
 * Base function to make authenticated requests to Google APIs
 */
export async function fetchGoogleApi(
  userId: string,
  endpoint: string,
  options: RequestInit = {}
): Promise<any> {
  // Get a valid access token
  const accessToken = await getValidAccessToken(userId);
  
  if (!accessToken) {
    throw new Error('No valid access token available');
  }
  
  // Set up headers with the access token
  const headers = new Headers(options.headers || {});
  headers.set('Authorization', `Bearer ${accessToken}`);
  
  // Make the request
  const response = await fetch(endpoint, {
    ...options,
    headers,
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Google API request failed: ${response.status} ${errorText}`);
  }
  
  return response.json();
}

/**
 * Get the user's Gmail profile information
 */
export async function getGmailProfile(userId: string): Promise<any> {
  return fetchGoogleApi(
    userId,
    'https://gmail.googleapis.com/gmail/v1/users/me/profile'
  );
}

/**
 * List Gmail messages with optional query parameters
 */
export async function listGmailMessages(
  userId: string,
  params: {
    maxResults?: number;
    q?: string;
    labelIds?: string[];
    pageToken?: string;
  } = {}
): Promise<any> {
  // Build query string from params
  const queryParams = new URLSearchParams();
  
  if (params.maxResults) {
    queryParams.set('maxResults', params.maxResults.toString());
  }
  
  if (params.q) {
    queryParams.set('q', params.q);
  }
  
  if (params.labelIds && params.labelIds.length > 0) {
    params.labelIds.forEach(labelId => {
      queryParams.append('labelIds', labelId);
    });
  }
  
  if (params.pageToken) {
    queryParams.set('pageToken', params.pageToken);
  }
  
  const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
  
  return fetchGoogleApi(
    userId,
    `https://gmail.googleapis.com/gmail/v1/users/me/messages${queryString}`
  );
}

/**
 * Get a specific Gmail message by ID
 */
export async function getGmailMessage(userId: string, messageId: string, format: 'full' | 'minimal' | 'raw' = 'full'): Promise<any> {
  return fetchGoogleApi(
    userId,
    `https://gmail.googleapis.com/gmail/v1/users/me/messages/${messageId}?format=${format}`
  );
}

/**
 * Send a Gmail message
 */
export async function sendGmailMessage(userId: string, message: string): Promise<any> {
  // The message should be base64url encoded
  const encodedMessage = btoa(message)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
  
  return fetchGoogleApi(
    userId,
    'https://gmail.googleapis.com/gmail/v1/users/me/messages/send',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        raw: encodedMessage,
      }),
    }
  );
}

/**
 * List Gmail labels
 */
export async function listGmailLabels(userId: string): Promise<any> {
  return fetchGoogleApi(
    userId,
    'https://gmail.googleapis.com/gmail/v1/users/me/labels'
  );
}

/**
 * Get user's Google Drive files
 */
export async function listDriveFiles(
  userId: string,
  params: {
    pageSize?: number;
    q?: string;
    orderBy?: string;
    pageToken?: string;
  } = {}
): Promise<any> {
  // Build query string from params
  const queryParams = new URLSearchParams();
  
  if (params.pageSize) {
    queryParams.set('pageSize', params.pageSize.toString());
  }
  
  if (params.q) {
    queryParams.set('q', params.q);
  }
  
  if (params.orderBy) {
    queryParams.set('orderBy', params.orderBy);
  }
  
  if (params.pageToken) {
    queryParams.set('pageToken', params.pageToken);
  }
  
  const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
  
  return fetchGoogleApi(
    userId,
    `https://www.googleapis.com/drive/v3/files${queryString}`
  );
}

/**
 * Get user's Google Calendar events
 */
export async function listCalendarEvents(
  userId: string,
  calendarId: string = 'primary',
  params: {
    timeMin?: string;
    timeMax?: string;
    maxResults?: number;
    singleEvents?: boolean;
    orderBy?: string;
    pageToken?: string;
  } = {}
): Promise<any> {
  // Build query string from params
  const queryParams = new URLSearchParams();
  
  if (params.timeMin) {
    queryParams.set('timeMin', params.timeMin);
  }
  
  if (params.timeMax) {
    queryParams.set('timeMax', params.timeMax);
  }
  
  if (params.maxResults) {
    queryParams.set('maxResults', params.maxResults.toString());
  }
  
  if (params.singleEvents !== undefined) {
    queryParams.set('singleEvents', params.singleEvents.toString());
  }
  
  if (params.orderBy) {
    queryParams.set('orderBy', params.orderBy);
  }
  
  if (params.pageToken) {
    queryParams.set('pageToken', params.pageToken);
  }
  
  const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
  
  return fetchGoogleApi(
    userId,
    `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events${queryString}`
  );
} 