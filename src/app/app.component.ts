import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { FormsModule } from '@angular/forms';

type StepState = 'current' | 'disabled' | 'validated';

interface StepItem {
  label: string;
  icon: string;
  state: StepState;
}

interface ToastItem {
  id: number;
  title: string;
  message: string;
  type: 'error' | 'success';
}

interface ReparateurItem {
  code: string;
  nom: string;
  cp: string;
  ville: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  isEditMode = false;
  showErrors = false;
  openDropdown = false;

  reparateur = '';
  reparateurInput = '';

  marque = '';
  modele = '';
  version = '';

  readonly immatriculation = 'FQ684WX';
  readonly numeroSerie = 'USYPH812GLL906264';
  readonly dateMec = '25/06/2026';
  readonly dossier = 'XXXXXXX';

  readonly civilite = 'M';
  readonly prenom = 'Thierry';
  readonly nom = 'MERLE';

  readonly mail = 'informatique@opteven.com';
  readonly adresse = '58 Chemin de saint roch';
  readonly cp = '38390';
  readonly ville = 'BUOIVESSE QUIRIEU';
  readonly pays = 'France';

  readonly reparateurs: ReparateurItem[] = [
    {
      code: 'FEUVERT091',
      nom: 'FEU VERT AMBUTRIX',
      cp: '01500',
      ville: 'AMBUTRIX',
    },
    {
      code: 'MIDAS001',
      nom: 'MIDAS LYON PART-DIEU',
      cp: '69003',
      ville: 'LYON',
    },
    {
      code: 'NORAUTO014',
      nom: 'NORAUTO VILLEFRANCHE',
      cp: '69400',
      ville: 'VILLEFRANCHE-SUR-SAONE',
    },
    {
      code: 'SPEEDY078',
      nom: 'SPEEDY BOURGOIN',
      cp: '38300',
      ville: 'BOURGOIN-JALLIEU',
    },
  ];

  reparateursFiltres: ReparateurItem[] = [...this.reparateurs];

  readonly marques = ['Kia', 'Peugeot', 'Renault', 'Volkswagen'];

  readonly modelesParMarque: Record<string, string[]> = {
    Kia: ['Sportage', 'Ceed', 'Niro'],
    Peugeot: ['208', '308', '3008'],
    Renault: ['Clio', 'Captur', 'Austral'],
    Volkswagen: ['Golf', 'Tiguan', 'Polo'],
  };

  readonly versionsParModele: Record<string, string[]> = {
    Sportage: ['1.6 GDi', '1.6 CRDi', 'GT Line'],
    Ceed: ['1.0 T-GDi', '1.5 T-GDi', 'GT Line'],
    Niro: ['Hybrid', 'Plug-in Hybrid', 'EV'],
    '208': ['PureTech 100', 'BlueHDi 100', 'GT'],
    '308': ['PureTech 130', 'BlueHDi 130', 'GT'],
    '3008': ['PureTech 130', 'BlueHDi 130', 'Hybrid'],
    Clio: ['TCe 90', 'Blue dCi 100', 'Esprit Alpine'],
    Captur: ['TCe 90', 'E-Tech Full Hybrid', 'Techno'],
    Austral: ['Mild Hybrid', 'E-Tech Full Hybrid', 'Iconic'],
    Golf: ['1.0 eTSI', '2.0 TDI', 'R-Line'],
    Tiguan: ['1.5 eTSI', '2.0 TDI', 'Elegance'],
    Polo: ['1.0 MPI', '1.0 TSI', 'Style'],
  };

  steps: StepItem[] = [
    { label: 'Informations véhicule', state: 'current', icon: '✓' },
    { label: 'Information dossier', state: 'disabled', icon: '📄' },
    { label: 'Devis', state: 'disabled', icon: '🔧' },
    { label: 'Infos supplémentaires', state: 'disabled', icon: '📎' },
    { label: 'Récapitulatif', state: 'disabled', icon: '☰' },
  ];

  toasts: ToastItem[] = [];
  private toastId = 0;

  get clientAffichage(): string {
    return `${this.civilite} ${this.prenom} ${this.nom}`;
  }

  get vehiculeAffichage(): string {
    const marque = (this.marque || '').trim();
    const modele = (this.modele || '').trim();

    if (!marque && !modele) {
      return 'Kia';
    }

    if (marque && modele) {
      return `${marque} ${modele}`;
    }

    return marque || modele;
  }

  get modelesDisponibles(): string[] {
    return this.modelesParMarque[this.marque] ?? [];
  }

  get versionsDisponibles(): string[] {
    return this.versionsParModele[this.modele] ?? [];
  }

  activerModification(): void {
    this.isEditMode = true;
    this.clearToasts();
  }

  onMarqueChange(): void {
    this.modele = '';
    this.version = '';
  }

  onModeleChange(): void {
    this.version = '';
  }

  formatReparateur(item: ReparateurItem): string {
    return `${item.code} – ${item.nom} ${item.cp} ${item.ville}`;
  }

  filtrerReparateurs(): void {
    const valeur = this.reparateurInput.trim().toLowerCase();

    this.reparateursFiltres = this.reparateurs.filter((rep) =>
      `${rep.code} ${rep.nom} ${rep.cp} ${rep.ville}`
        .toLowerCase()
        .includes(valeur)
    );

    this.openDropdown = true;
    this.reparateur = '';
  }

  ouvrirDropdown(): void {
    this.reparateursFiltres = [...this.reparateurs];
    this.openDropdown = true;
  }

  selectReparateur(rep: ReparateurItem): void {
    this.reparateur = this.formatReparateur(rep);
    this.reparateurInput = this.reparateur;
    this.openDropdown = false;
  }

  sauvegarder(showToast: boolean = true): void {
    this.clearToasts();
    this.showErrors = false;

    if (showToast) {
      this.addToast(
        'Succès',
        'Le dossier a été sauvegardé en brouillon',
        'success'
      );
    }
  }

  suivantConsultation(): void {
    this.clearToasts();
    this.showErrors = true;

    if (!this.reparateur.trim()) {
      this.addToast('Erreur', 'Le réparateur est obligatoire.', 'error');
      return;
    }

    this.addToast('Succès', 'Passage à l’étape suivante.', 'success');
  }

  validerEtContinuer(): void {
    this.clearToasts();
    this.showErrors = true;

    if (!this.reparateur.trim()) {
      this.addToast('Erreur', 'Le réparateur est obligatoire.', 'error');
      return;
    }

    this.addToast(
      'Succès',
      'Étape validée. Passage à l’étape suivante.',
      'success'
    );
  }

  addToast(title: string, message: string, type: 'error' | 'success'): void {
    const id = ++this.toastId;
    this.toasts.push({ id, title, message, type });
  }

  closeToast(id: number): void {
    this.toasts = this.toasts.filter((toast) => toast.id !== id);
  }

  clearToasts(): void {
    this.toasts = [];
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement | null;
    if (!target?.closest('.reparateur-autocomplete')) {
      this.openDropdown = false;
    }
  }
}
