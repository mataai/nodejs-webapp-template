import { Injectable } from '@nestjs/common';

@Injectable()
export class TournamentsRepository {

  // public async tournament(
  //   tournamentWhereUniqueInput: Prisma.TournamentWhereUniqueInput
  // ): Promise<Tournament | null> {
  //   return this._prismaClient.tournament.findUnique({
  //     where: tournamentWhereUniqueInput
  //   });
  // }

  // public async tournaments(options: {
  //   skip?: number;
  //   take?: number;
  //   cursor?: Prisma.TournamentWhereUniqueInput;
  //   where?: Prisma.TournamentWhereInput;
  //   orderBy?: Prisma.TournamentOrderByWithRelationInput;
  // }): Promise<Tournament[]> {
  //   const { skip, take, cursor, where, orderBy } = options;

  //   return this._prismaClient.tournament.findMany({
  //     skip,
  //     take,
  //     cursor,
  //     where,
  //     orderBy
  //   });
  // }

  // public async createTournament(
  //   data: Prisma.TournamentCreateInput
  // ): Promise<Tournament> {
  //   return this._prismaClient.tournament.create({
  //     data
  //   });
  // }

  // public async updateTournament(options: {
  //   where: Prisma.TournamentWhereUniqueInput;
  //   data: Prisma.TournamentUpdateInput;
  // }): Promise<Tournament> {
  //   const { where, data } = options;
  //   return this._prismaClient.tournament.update({
  //     data,
  //     where
  //   });
  // }

  // public async deleteTournament(
  //   where: Prisma.TournamentWhereUniqueInput
  // ): Promise<Tournament> {
  //   return this._prismaClient.tournament.delete({
  //     where
  //   });
  // }
}
