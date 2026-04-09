import { PAESubject } from './pae-subject.model';
import { PAISubject } from './pai-subject.model';
import { PFSubject } from './pf-subject.model';
import { PGSubject } from './pg-subject.model';
import { SWSubject } from './sw-subject.model';
import { ASSubject } from './as-subject.model';

export abstract class SubjectVisitor
{
    public abstract visitPaeSubject(subject: PAESubject): void;
    public abstract visitPaiSubject(subject: PAISubject): void;
    public abstract visitPfSubject(subject: PFSubject): void;
    public abstract visitPgSubject(subject: PGSubject): void;
    public abstract visitSWSubject(subject: SWSubject): void;
    public abstract visitAsSubject(subject: ASSubject): void;
}

