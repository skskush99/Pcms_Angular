import { Component, OnInit } from '@angular/core';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [DashboardComponent, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  theme: 'default' | 'dark' | 'contrast' = 'default';
  language: 'en' | 'hi' = 'en';

  private fontScale = 1;
  private readonly minFontScale = 0.85;
  private readonly maxFontScale = 1.15;
  private readonly fontStep = 0.05;

  ngOnInit(): void {
    const savedTheme = localStorage.getItem('ui.theme');
    if (savedTheme === 'default' || savedTheme === 'dark' || savedTheme === 'contrast') {
      this.theme = savedTheme;
    }

    const savedLang = localStorage.getItem('ui.lang');
    if (savedLang === 'en' || savedLang === 'hi') {
      this.language = savedLang;
    }

    const savedScale = Number(localStorage.getItem('ui.fontScale'));
    if (Number.isFinite(savedScale) && savedScale > 0) {
      this.fontScale = this.clamp(savedScale, this.minFontScale, this.maxFontScale);
    }

    this.applyTheme();
    this.applyLanguage();
    this.applyFontScale();
  }

  increaseFont(): void {
    this.fontScale = this.clamp(this.fontScale + this.fontStep, this.minFontScale, this.maxFontScale);
    this.applyFontScale();
  }

  decreaseFont(): void {
    this.fontScale = this.clamp(this.fontScale - this.fontStep, this.minFontScale, this.maxFontScale);
    this.applyFontScale();
  }

  resetFont(): void {
    this.fontScale = 1;
    this.applyFontScale();
  }

  setTheme(theme: string): void {
    if (theme === 'default' || theme === 'dark' || theme === 'contrast') {
      this.theme = theme;
      this.applyTheme();
    }
  }

  setLanguage(lang: string): void {
    if (lang === 'en' || lang === 'hi') {
      this.language = lang;
      this.applyLanguage();
    }
  }

  onSearch(query: string): void {
    const q = (query ?? '').trim();
    if (!q) return;
    // Hook this to your real search page/API when available.
    console.log('Search:', q);
  }

  private applyTheme(): void {
    const root = document.documentElement;
    if (this.theme === 'default') {
      root.removeAttribute('data-theme');
    } else {
      root.setAttribute('data-theme', this.theme);
    }
    localStorage.setItem('ui.theme', this.theme);
  }

  private applyLanguage(): void {
    document.documentElement.lang = this.language;
    localStorage.setItem('ui.lang', this.language);
  }

  private applyFontScale(): void {
    document.documentElement.style.setProperty('--font-scale', String(this.fontScale));
    localStorage.setItem('ui.fontScale', String(this.fontScale));
  }

  private clamp(value: number, min: number, max: number): number {
    return Math.min(max, Math.max(min, value));
  }

}
