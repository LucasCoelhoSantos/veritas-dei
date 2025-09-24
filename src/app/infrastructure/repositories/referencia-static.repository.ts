import { Injectable } from '@angular/core';
import { Referencia } from '../../domain/models/mensagem.model';

@Injectable({ providedIn: 'root' })
export class ReferenciaStaticRepository {
  obterTodas(): Referencia[] {
    return [
      { titulo: 'Site Oficial do Vaticano', url: 'https://www.vatican.va/content/vatican/pt.html' },
      { titulo: 'Catecismo da Igreja Católica', url: 'https://www.vatican.va/archive/cathechism_po/index_new/prima-pagina-cic_po.html' },
      { titulo: 'Compêndio do Catecismo', url: 'https://www.vatican.va/archive/compendium_ccc/documents/archive_2005_compendium-ccc_po.html' },
      { titulo: 'Documentos do Vaticano I', url: 'https://www.vatican.va/archive/hist_councils/i-vatican-council/index_po.htm' },
      { titulo: 'Documentos do Vaticano II', url: 'https://www.vatican.va/archive/hist_councils/ii_vatican_council/index_po.htm' },
      { titulo: 'Sagrada Escritura', url: 'https://www.vatican.va/archive/bible/index_po.htm' },
      { titulo: 'Encíclicas Papais', url: 'https://www.vatican.va/content/vatican/pt/holy-father.html' },
      { titulo: 'Compêndio da Doutrina Social da Igreja', url: 'https://www.vatican.va/roman_curia/pontifical_councils/justpeace/documents/rc_pc_justpeace_doc_20060526_compendio-dott-soc_po.html' },
      { titulo: 'Santo Padre - Site Oficial', url: 'https://www.vatican.va/content/francesco/pt.html' }
    ];
  }
}