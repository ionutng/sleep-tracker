import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { SleepRecord } from '../sleep-record';
import { SleepRecordService } from '../sleep-record.service';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { provideNativeDateAdapter } from '@angular/material/core';

@Component({
  selector: 'app-edit',
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
  templateUrl: './edit.component.html',
  styleUrl: './edit.component.css',
  providers: [provideNativeDateAdapter()]
})
export class EditComponent implements OnInit {
  editSleepRecordForm!: FormGroup;
  sleepRecord!: SleepRecord;

  constructor(
    private sleepRecordService: SleepRecordService,
    private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit(): void{
    this.initializeForm();
  };

  private initializeForm(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    if (isNaN(id)) {
      console.log('Invalid ID');
      this.router.navigate(['/sleep-record/index']);
      return;
    }

    this.sleepRecordService.getSleepRecord(id).subscribe((sleepRecord) => {
      if (sleepRecord) {
        this.populateForm(sleepRecord);
        this.sleepRecord = sleepRecord;
      } else {
        console.log('Sleep record not found.');
        this.router.navigate(['/sleep-record/index']);
      }
    });
  }

  private populateForm(sleepRecord: SleepRecord): void {
    sleepRecord.fallAsleepTime = sleepRecord.fallAsleepTime.substring(0,5);
    sleepRecord.wakeUpTime = sleepRecord.wakeUpTime.substring(0,5);
    sleepRecord.sleepDuration = sleepRecord.sleepDuration!.substring(0,5);
    
    const formattedDate = new Date(sleepRecord.date);

    this.editSleepRecordForm = new FormGroup({
      date: new FormControl(formattedDate, Validators.required),
      fallAsleepTime: new FormControl(sleepRecord.fallAsleepTime, Validators.required),
      wakeUpTime: new FormControl(sleepRecord.wakeUpTime, Validators.required)
    });
  }

  editSleepRecord(): void {
    const id = this.sleepRecord.id;
    const date = this.editSleepRecordForm.value.date.toLocaleDateString('fr-CA'); 
    const fallAsleepTime = this.editSleepRecordForm.value.fallAsleepTime + ":00";
    const wakeUpTime = this.editSleepRecordForm.value.wakeUpTime + ":00";

    if (!this.dateAndTimeValidation(date, fallAsleepTime, wakeUpTime)) {
      alert('Invalid sleep record data!');
      return;
    }

    const sleepRecord: SleepRecord = {
      id,
      date,
      fallAsleepTime,
      wakeUpTime
    }

    this.sleepRecordService.updateSleepRecord(sleepRecord).subscribe(() => {
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
