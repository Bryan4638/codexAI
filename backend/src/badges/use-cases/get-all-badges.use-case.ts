import { Injectable } from '@nestjs/common';
import { badges } from '../data/badges.data';
import { Badge } from '../../common/types';

export interface GetAllBadgesResult {
  badges: Badge[];
}

@Injectable()
export class GetAllBadgesUseCase {
  execute(): GetAllBadgesResult {
    return { badges };
  }
}
