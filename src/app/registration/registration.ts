import { Component, signal, OnDestroy } from '@angular/core';
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
export class Registration implements OnDestroy {
  submitted = signal(false);
  loading = signal(false);
  error = signal('');

  // Geri sayım — 16 Nisan 2026 saat 12:00
  readonly targetDate = new Date('2026-04-16T12:00:00');
  countdown = signal({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  private countdownInterval: ReturnType<typeof setInterval> | null = null;

  private updateCountdown() {
    const diff = this.targetDate.getTime() - Date.now();
    if (diff <= 0) {
      this.countdown.set({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      if (this.countdownInterval) clearInterval(this.countdownInterval);
      return;
    }
    const days = Math.floor(diff / 86400000);
    const hours = Math.floor((diff % 86400000) / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);
    this.countdown.set({ days, hours, minutes, seconds });
  }

  private startCountdown() {
    this.updateCountdown();
    this.countdownInterval = setInterval(() => this.updateCountdown(), 1000);
  }

  ngOnDestroy() {
    if (this.countdownInterval) clearInterval(this.countdownInterval);
  }

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
        this.startCountdown();
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
    if (this.countdownInterval) { clearInterval(this.countdownInterval); this.countdownInterval = null; }
  }
}
