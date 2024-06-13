import { Component, OnInit } from '@angular/core';
import { SleepRecord } from '../sleep-record';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { SleepRecordService } from '../sleep-record.service';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-view',
  standalone: true,
  imports: [
    MatButtonModule,
    MatCardModule,
    MatDividerModule,
    MatIconModule,
    MatProgressBarModule,
    DatePipe,
    RouterLink
  ],
  templateUrl: './view.component.html',
  styleUrl: './view.component.css'
})
export class ViewComponent implements OnInit {
  sleepRecord!: SleepRecord;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private sleepRecordService: SleepRecordService) { }

  ngOnInit(): void {
    this.loadSleepRecord();
  }

  private loadSleepRecord(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    if (isNaN(id)) {
      console.log('Invalid ID');
      this.router.navigate(['/sleep-record/index']);
      return;
    }

    this.sleepRecordService.getSleepRecord(id).subscribe((sleepRecord) => {
      if (sleepRecord) {
        sleepRecord.fallAsleepTime = sleepRecord.fallAsleepTime.substring(0,5);
        sleepRecord.wakeUpTime = sleepRecord.wakeUpTime.substring(0,5);
        sleepRecord.sleepDuration = sleepRecord.sleepDuration!.substring(0,5);
        
        this.sleepRecord = sleepRecord;
      } else {
        console.log(`Couldn't find sleep record with ID=${id}`);
        this.router.navigate(['/sleep-record/index']);
        return;
      }
    });
  }
}
