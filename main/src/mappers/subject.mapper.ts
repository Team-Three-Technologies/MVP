import { injectable } from 'tsyringe';
import { Subject } from '../domain/subject.model';
import { RolesTypeEnum } from '../domain/roles-type.enum';
import { ASSubject } from '../domain/as-subject.model';
import { PFSubject } from '../domain/pf-subject.model';
import { PGSubject } from '../domain/pg-subject.model';
import { PAESubject } from '../domain/pae-subject.model';
import { PAISubject } from '../domain/pai-subject.model';
import { SWSubject } from '../domain/sw-subject.model';
import { Person } from '../domain/person.model';
import {
  RuoloXml,
  TipoSoggetto11Xml,
  TipoSoggetto12Xml,
  TipoSoggetto13Xml,
  TipoSoggetto21Xml,
  TipoSoggetto22Xml,
  TipoSoggetto31Xml,
  TipoSoggetto32Xml,
  TipoSoggetto33Xml,
  TipoSoggetto34Xml,
  TipoSoggetto4Xml,
} from '../infrastructure/parsing/document-metadata.xml';

type SubjectRoleEntry = {
  roleType: RolesTypeEnum;
  subject: Subject;
};

type RolePayload =
  | TipoSoggetto11Xml
  | TipoSoggetto12Xml
  | TipoSoggetto13Xml
  | TipoSoggetto21Xml
  | TipoSoggetto22Xml
  | TipoSoggetto31Xml
  | TipoSoggetto32Xml
  | TipoSoggetto33Xml
  | TipoSoggetto34Xml
  | TipoSoggetto4Xml;

@injectable()
export class SubjectMapper {
  private toSubjectFromPayload(payload: RolePayload): Subject | undefined {
    if ('AS' in payload && payload.AS) {
      return new ASSubject(
        null,
        new Person(payload.AS.Nome, payload.AS.Cognome, payload.AS.CodiceFiscale),
        payload.AS.DenominazioneOrganizzazione,
        payload.AS.DenominazioneUfficio,
        payload.AS.IndirizziDigitaliDiRiferimento ?? [],
      );
    }

    if ('SW' in payload && payload.SW) {
      return new SWSubject(null, payload.SW.DenominazioneSistema);
    }

    if ('PF' in payload && payload.PF) {
      return new PFSubject(
        null,
        new Person(payload.PF.Nome, payload.PF.Cognome, payload.PF.CodiceFiscale),
        payload.PF.IndirizziDigitaliDiRiferimento ?? [],
      );
    }

    if ('PG' in payload && payload.PG) {
      return new PGSubject(
        null,
        payload.PG.DenominazioneOrganizzazione,
        payload.PG.CodiceFiscale_PartitaIva,
        payload.PG.DenominazioneUfficio,
        payload.PG.IndirizziDigitaliDiRiferimento ?? [],
      );
    }

    if ('PAI' in payload && payload.PAI) {
      return new PAISubject(
        null,
        payload.PAI.IPAAmm.Denominazione,
        payload.PAI.IPAAmm.CodiceIPA,
        payload.PAI.IPAAOO?.Denominazione,
        payload.PAI.IPAAOO?.CodiceIPA,
        payload.PAI.IPAUOR?.Denominazione,
        payload.PAI.IPAUOR?.CodiceIPA,
        payload.PAI.IndirizziDigitaliDiRiferimento ?? [],
      );
    }

    if ('PAE' in payload && payload.PAE) {
      return new PAESubject(
        null,
        payload.PAE.DenominazioneAmministrazione,
        payload.PAE.DenominazioneUfficio,
        payload.PAE.IndirizziDigitaliDiRiferimento ?? [],
      );
    }

    return undefined;
  }

  private pickRolePayload(
    role: RuoloXml,
  ): { roleType: RolesTypeEnum; payload: RolePayload } | undefined {
    if (role.Altro) return { roleType: RolesTypeEnum.ALT, payload: role.Altro };
    if (role.Assegnatario) return { roleType: RolesTypeEnum.ASS, payload: role.Assegnatario };
    if (role.Autore) return { roleType: RolesTypeEnum.AUT, payload: role.Autore };
    if (role.Destinatario) return { roleType: RolesTypeEnum.DES, payload: role.Destinatario };
    if (role.Mittente) return { roleType: RolesTypeEnum.MIT, payload: role.Mittente };
    if (role.Operatore) return { roleType: RolesTypeEnum.OPE, payload: role.Operatore };
    if (role.Produttore) return { roleType: RolesTypeEnum.PRO, payload: role.Produttore };
    if (role.ResponsabileGestioneDocumentale)
      return {
        roleType: RolesTypeEnum.RGD,
        payload: role.ResponsabileGestioneDocumentale,
      };
    if (role.ResponsabileServizioProtocollo)
      return {
        roleType: RolesTypeEnum.RSP,
        payload: role.ResponsabileServizioProtocollo,
      };
    if (role.SoggettoCheEffettuaLaRegistrazione)
      return {
        roleType: RolesTypeEnum.SER,
        payload: role.SoggettoCheEffettuaLaRegistrazione,
      };
    return undefined;
  }

  public toDomain(roles: RuoloXml[]): SubjectRoleEntry[] {
    return roles
      .map((role) => {
        const picked = this.pickRolePayload(role);
        if (!picked) return undefined;

        const subject = this.toSubjectFromPayload(picked.payload);
        if (!subject) return undefined;

        return {
          roleType: picked.roleType,
          subject,
        } as SubjectRoleEntry;
      })
      .filter((e): e is SubjectRoleEntry => e !== undefined);
  }
}
