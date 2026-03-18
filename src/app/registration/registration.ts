import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SheetsService } from './sheets.service';

interface RegistrationForm {
  firstName: string;
  lastName: string;
  department: string;
  grade: string;
  studentNumber: string;
  faculty: string;
  phone: string;
}

@Component({
  selector: 'app-registration',
  imports: [FormsModule, CommonModule],
  templateUrl: './registration.html',
  styleUrl: './registration.css'
})
export class Registration {
  submitted = signal(false);
  loading = signal(false);
  error = signal('');

  form: RegistrationForm = {
    firstName: '',
    lastName: '',
    department: '',
    grade: '',
    studentNumber: '',
    faculty: '',
    phone: ''
  };

  grades = ['Hazırlık', '1. Sınıf', '2. Sınıf', '3. Sınıf', '4. Sınıf', '5. Sınıf', '6. Sınıf'];

  // Sadece harf ve boşluk (ad, soyad, fakülte, bölüm)
  onlyLetters(e: KeyboardEvent) {
    const allowed = /^[a-zA-ZğüşıöçĞÜŞİÖÇ\s]$/;
    if (!allowed.test(e.key) && !['Backspace','Delete','ArrowLeft','ArrowRight','Tab'].includes(e.key)) {
      e.preventDefault();
    }
  }

  // Sadece rakam (öğrenci no, telefon)
  onlyNumbers(e: KeyboardEvent) {
    if (!/^\d$/.test(e.key) && !['Backspace','Delete','ArrowLeft','ArrowRight','Tab'].includes(e.key)) {
      e.preventDefault();
    }
  }

  constructor(private sheets: SheetsService) {}

  onSubmit() {
    this.loading.set(true);
    this.error.set('');
    console.log('Gönderilen veri:', this.form);

    this.sheets.saveRegistration(this.form).subscribe({
      next: () => {
        this.loading.set(false);
        this.submitted.set(true);
      },
      error: () => {
        this.loading.set(false);
        this.error.set('Kayıt sırasında bir hata oluştu. Lütfen tekrar dene.');
      }
    });
  }

  reset() {
    this.form = { firstName: '', lastName: '', department: '', grade: '', studentNumber: '', faculty: '', phone: '' };
    this.submitted.set(false);
    this.error.set('');
  }
}
