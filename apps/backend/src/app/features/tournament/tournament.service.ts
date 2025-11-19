import { TournamentDTO } from "@webapp-template/tournament-contracts";

export class TournamentService {
  private tournaments: TournamentDTO[];
  constructor() {
    this.tournaments = [];
  }
  public create(tournament: TournamentDTO): void {
    this.tournaments.push(tournament);
  }
  public findAll(): TournamentDTO[] {
    return this.tournaments;
  }
}
