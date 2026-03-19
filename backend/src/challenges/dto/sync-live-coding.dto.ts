import { PartialType, PickType } from '@nestjs/swagger';
import { SubmitLiveCodingDto } from './submit-live-coding.dto';

export class SyncLiveCodingDto extends PickType(SubmitLiveCodingDto, [
    'sessionId',
    'code',
    'tabSwitches',
    'copyPasteCount',
] as const) {}
