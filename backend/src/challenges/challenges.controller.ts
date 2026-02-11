import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../auth/entities/user.entity';
import { CreateChallengeDto } from './dto/create-challenge.dto';
import { CreateChallengeUseCase } from './use-cases/create-challenge.use-case';
import { GetChallengesUseCase } from './use-cases/get-challenges.use-case';
import { ToggleReactionUseCase } from './use-cases/toggle-reaction.use-case';
import { DeleteChallengeUseCase } from './use-cases/delete-challenge.use-case';

@Controller('challenges')
export class ChallengesController {
  constructor(
    private readonly createChallengeUseCase: CreateChallengeUseCase,
    private readonly getChallengesUseCase: GetChallengesUseCase,
    private readonly toggleReactionUseCase: ToggleReactionUseCase,
    private readonly deleteChallengeUseCase: DeleteChallengeUseCase,
  ) {}

  @Get()
  getChallenges(
    @Query('difficulty') difficulty?: string,
    @Query('sort') sort?: string,
  ) {
    return this.getChallengesUseCase.execute({ difficulty, sort });
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  createChallenge(@CurrentUser() user: User, @Body() dto: CreateChallengeDto) {
    return this.createChallengeUseCase.execute(user.id, dto);
  }

  @Post(':id/react')
  @UseGuards(JwtAuthGuard)
  toggleReaction(@CurrentUser() user: User, @Param('id') id: string) {
    return this.toggleReactionUseCase.execute(user.id, id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  deleteChallenge(@CurrentUser() user: User, @Param('id') id: string) {
    return this.deleteChallengeUseCase.execute(user.id, id);
  }
}
