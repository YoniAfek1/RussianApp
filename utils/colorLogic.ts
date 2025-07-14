// TODO: Logic to map status to font color

export type WordStatus = 'red' | 'yellow' | 'green' | null;

export function getStatusColor(status: WordStatus): string {
  switch (status) {
    case 'red':
      return '#ff4444';
    case 'yellow':
      return '#ffbb33';
    case 'green':
      return '#00C851';
    default:
      return '#333333';
  }
}

export function getStatusClass(status: WordStatus): string {
  switch (status) {
    case 'red':
      return 'status-red';
    case 'yellow':
      return 'status-yellow';
    case 'green':
      return 'status-green';
    default:
      return 'status-default';
  }
}

export function getStatusEmoji(status: WordStatus): string {
  switch (status) {
    case 'red':
      return '🔴';
    case 'yellow':
      return '🟡';
    case 'green':
      return '🟢';
    default:
      return '⚪';
  }
}

export function getStatusText(status: WordStatus): string {
  switch (status) {
    case 'red':
      return 'Difficult';
    case 'yellow':
      return 'In Progress';
    case 'green':
      return 'Mastered';
    default:
      return 'Not Started';
  }
}