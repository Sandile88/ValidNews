export interface Story {
  id: string;
  title: string;
  link: string;
  submittedBy: string;
  timestamp: number;
  status: 'pending' | 'true' | 'false';
  votesTrue: number;
  votesFalse: number;
}

export interface Vote {
  storyId: string;
  voter: string;
  isTrue: boolean;
}
