import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { SleepRecord } from '../sleep-record';
import { SleepRecordService } from '../sleep-record.service';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-index',
  standalone: true,
  imports: [
    MatButtonModule,
    MatDividerModule,
    MatIconModule,
    MatPaginator,
    MatPaginatorModule,
    MatTableModule,
    RouterLink,
    DatePipe
  ],
  templateUrl: './index.component.html',
  styleUrl: './index.component.css'
})
export class IndexComponent implements OnInit {
  displayedColumns: string[] = ['Date', 'Fall Asleep Time', 'Wake Up Time', 'Sleep Duration', 'Options'];
  sleepRecords = new MatTableDataSource<SleepRecord>();
  sortDescending: boolean = true;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private sleepRecordService: SleepRecordService) { }

  ngOnInit(): void {
    this.loadSleepRecords();
  }

  private loadSleepRecords(): void {
    this.sleepRecordService.getSleepRecords().subscribe((sleepRecords) => {
      sleepRecords.forEach(sleepRecord => {
        sleepRecord.fallAsleepTime = sleepRecord.fallAsleepTime.slice(0,5);
        sleepRecord.wakeUpTime = sleepRecord.wakeUpTime.slice(0,5);
        sleepRecord.sleepDuration = sleepRecord.sleepDuration!.slice(0,5);
      });

      this.sleepRecords.data = sleepRecords;
      this.sleepRecords.paginator = this.paginator;
      this.sortSleepRecords('date');
    });
  }

  sortSleepRecords(option:string): void {
    switch (option) {
      case 'date':
        this.sortByDate();
        break;
      case 'fallAsleepTime':
        this.sortByTime('fallAsleepTime');
        break;
      case 'wakeUpTime':
        this.sortByTime('wakeUpTime');
        break;
      case 'sleepDuration':
        this.sortByTime('sleepDuration');
        break;
    }
    this.sortDescending = !this.sortDescending;
  }

  private sortByDate(): void {
    this.sleepRecords.data = this.sleepRecords.data.sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return this.sortDescending ? dateB - dateA : dateA - dateB;
    });
  }

  private sortByTime(property: keyof SleepRecord): void {
    this.sleepRecords.data = this.sleepRecords.data.sort((a, b) => {
      const timeA = this.parseTime(a[property] as string);
      const timeB = this.parseTime(b[property] as string);
      return this.sortDescending ? timeB - timeA : timeA - timeB;
    });
  }

  private parseTime(time: string): number {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  }
}
