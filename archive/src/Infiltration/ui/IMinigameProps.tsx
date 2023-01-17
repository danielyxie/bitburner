export interface IMinigameProps {
  onSuccess: () => void;
  onFailure: (options?: {
    /** Failed due to using untrusted events (automation) */
    automated: boolean;
  }) => void;
  difficulty: number;
}
