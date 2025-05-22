// app/services/shareService.ts

export interface ShareData {
    title: string;
    text?: string;
    url: string;
  }
  
  export const shareService = {
    // Copy link to clipboard
    copyToClipboard: async (url: string): Promise<void> => {
      try {
        if (navigator.clipboard && window.isSecureContext) {
          // Use modern clipboard API if available
          await navigator.clipboard.writeText(url);
        } else {
          // Fallback for older browsers
          const textArea = document.createElement('textarea');
          textArea.value = url;
          textArea.style.position = 'fixed';
          textArea.style.left = '-999999px';
          textArea.style.top = '-999999px';
          document.body.appendChild(textArea);
          textArea.focus();
          textArea.select();
          
          try {
            document.execCommand('copy');
          } catch (err) {
            console.error('Failed to copy using fallback method:', err);
            throw new Error('Failed to copy to clipboard');
          } finally {
            document.body.removeChild(textArea);
          }
        }
      } catch (error) {
        console.error('Copy to clipboard failed:', error);
        throw new Error('Failed to copy to clipboard');
      }
    },
  
    // Use Web Share API if available, fallback to copy
    shareWorkspace: async (shareData: ShareData): Promise<{ method: 'native' | 'clipboard'; success: boolean }> => {
      try {
        // Check if Web Share API is supported
        if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
          await navigator.share(shareData);
          return { method: 'native', success: true };
        } else {
          // Fallback to copy to clipboard
          await shareService.copyToClipboard(shareData.url);
          return { method: 'clipboard', success: true };
        }
      } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') {
          // User cancelled the share
          return { method: 'native', success: false };
        }
        console.error('Share failed:', error);
        throw error;
      }
    },
  
    // Generate share URL for workspace
    generateWorkspaceShareUrl: (workspaceId: string): string => {
      const baseUrl = window.location.origin;
      return `${baseUrl}/workspaces/map/${workspaceId}`;
    },
  
    // Generate share text for workspace
    generateShareText: (workspaceName: string, workspaceType: string, workspaceAddress: string): string => {
      return `Check out ${workspaceName}, a great ${workspaceType.toLowerCase()} for studying and working! Located at ${workspaceAddress}. Found on Nomad Desk.`;
    },
  
    // Format share data for workspace
    formatWorkspaceShareData: (
      workspaceId: string,
      workspaceName: string,
      workspaceType: string,
      workspaceAddress: string
    ): ShareData => {
      return {
        title: `${workspaceName} - Nomad Desk`,
        text: shareService.generateShareText(workspaceName, workspaceType, workspaceAddress),
        url: shareService.generateWorkspaceShareUrl(workspaceId)
      };
    }
  };
  
  export default shareService;