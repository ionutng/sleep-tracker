import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { SleepRecord } from '../sleep-record';
import { SleepRecordService } from '../sleep-record.service';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@Component({
  selector: 'app-create',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    MatButtonModule,
    MatCardModule,
    MatDatepickerModule,
    MatDividerModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatProgressBarModule
  ],
  templateUrl: './create.component.html',
  styleUrl: './create.component.css',
  providers: [provideNativeDateAdapter()]
})
export class CreateComponent implements OnInit {
  addSleepRecordForm!: FormGroup;

  constructor(
    private sleepRecordService: SleepRecordService,
    private router: Router) { }

  ngOnInit(): void{
    this.initializeForm();
  };

  private initializeForm(): void {
    this.addSleepRecordForm = new FormGroup({
      date: new FormControl(null, Validators.required),
      fallAsleepTime: new FormControl('', Validators.required),
      wakeUpTime: new FormControl('', Validators.required)
    });
  }

  addSleepRecord(): void {
    const date = this.addSleepRecordForm.value.date.toLocaleDateString('fr-CA');
    const fallAsleepTime = this.addSleepRecordForm.value.fallAsleepTime + ":00";
    const wakeUpTime = this.addSleepRecordForm.value.wakeUpTime + ":00";

    if (!this.dateAndTimeValidation(date, fallAsleepTime, wakeUpTime)) {
      alert('Invalid sleep record data!');
      return;
    }

    const sleepRecord: SleepRecord = {
      date,
      fallAsleepTime,
      wakeUpTime
    }

    this.sleepRecordService.addSleepRecord(sleepRecord).subscribe(() => {
      this.router.navigate(['/sleep-record/index']);
    }); 
  }

  private dateAndTimeValidation(date: string, fallAsleepTime: string, wakeUpTime: string): boolean {
    const currentDate = new Date();
    const myDate = new Date(date);
    const [fallAsleepHours, fallAsleepMinutes] = fallAsleepTime.split(':').map(Number);

    if (myDate > currentDate) {
      return false;
    }

    if (myDate.toLocaleDateString('fr-CA') === currentDate.toLocaleDateString('fr-CA')) {
      if (fallAsleepHours > currentDate.getHours()) {
        return false;
      } else if (fallAsleepHours === currentDate.getHours() && fallAsleepMinutes >= currentDate.getMinutes()) {
        return false;
      }
    }

    return true;
  }
}
