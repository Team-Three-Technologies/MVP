import { ASSubject } from './as-subject.model';
import { PAESubject } from './pae-subject.model';
import { PAISubject } from './pai-subject.model';
import { PFSubject } from './pf-subject.model';
import { PGSubject } from './pg-subject.model';
import { SWSubject } from './sw-subject.model';

export interface SubjectVisitor<T> {
  visitAsSubject(subject: ASSubject): T;
  visitPaeSubject(subject: PAESubject): T;
  visitPaiSubject(subject: PAISubject): T;
  visitPfSubject(subject: PFSubject): T;
  visitPgSubject(subject: PGSubject): T;
  visitSwSubject(subject: SWSubject): T;
}
