import { Location } from '@angular/common';
import { Component, OnInit, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as Highcharts from 'highcharts';
import HighchartsGantt from 'highcharts/modules/gantt';

HighchartsGantt(Highcharts);

interface Task {
  name: string;
  assignee: string;
  status: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  slipDays: string;
}

const sprintDescriptions: { [key: string]: string } = {
  'Component Sourcing': 'Sourcing of critical machinery, sensor modules, pneumatic actuators, and electronic control boards',
  'Tooling & Dies': 'Design, fabrication, and precision milling of custom molds and stamping dies for chassis assembly',
  'Assembly Line Setup': 'Mechanical installation, floor layout alignment, pneumatic supply lines, and power grid connections',
  'PLC Programming': 'Developing ladder logic, safety interlocks, and HMI console interface for centralized control',
  'Dry Run Testing': 'Initial cycle runs without payload to verify automated sequencing and sensor triggering times',
  'First Article Inspection': 'Detailed metrological and physical testing of the first batch of assembled products',
  'Quality Certification': 'External agency verification of ISO/CE standards, electrical safety, and performance compliance',
  'Mass Production Ramp': 'Scaling up production rate, shifting scheduling, and validating operational throughput limits'
};

@Component({
  selector: 'app-project-analytics',
  templateUrl: './project-analytics.component.html',
  styleUrls: ['./project-analytics.component.scss']
})
export class ProjectAnalyticsComponent implements OnInit {

  Highcharts: typeof Highcharts = Highcharts;
  updateFlag: boolean = false;

  // --- Task Data (Manufacturing Focus) ---
  overdueTasks: Task[] = [
    { name: 'Hydraulic press calibration', assignee: 'Rajesh V.', status: 'CRITICAL', slipDays: '+8d' },
    { name: 'Raw material delay (Aluminium)', assignee: 'Priya S.', status: 'CRITICAL', slipDays: '+5d' },
    { name: 'Injection mold rework', assignee: 'Vikram K.', status: 'HIGH', slipDays: '+4d' },
    { name: 'Robotic welding arm setup', assignee: 'Neha R.', status: 'HIGH', slipDays: '+3d' },
    { name: 'Safety compliance audit', assignee: 'Arjun M.', status: 'MEDIUM', slipDays: '+2d' },
    { name: 'Packaging spec sign-off', assignee: 'Kiran P.', status: 'MEDIUM', slipDays: '+1d' },
    { name: 'Coolant system flush', assignee: 'Amit S.', status: 'MEDIUM', slipDays: '+1d' },
    { name: 'Electrical panel certification', assignee: 'Suresh N.', status: 'CRITICAL', slipDays: '+6d' },
    { name: 'Conveyor belt alignment', assignee: 'Ravi T.', status: 'HIGH', slipDays: '+3d' },
    { name: 'CNC program validation', assignee: 'Ananya L.', status: 'HIGH', slipDays: '+2d' },
    { name: 'Labeling machine calibration', assignee: 'John D.', status: 'MEDIUM', slipDays: '+1d' },
    { name: 'Final QA documentation', assignee: 'Meera K.', status: 'CRITICAL', slipDays: '+7d' }
  ];

  currentPage: number = 1;
  pageSize: number = 6;

  get totalPages(): number {
    return Math.ceil(this.overdueTasks.length / this.pageSize);
  }

  get paginatedTasks(): Task[] {
    const sorted = [...this.overdueTasks].sort((a, b) => {
      const aVal = parseInt(a.slipDays.replace(/[^0-9]/g, '')) || 0;
      const bVal = parseInt(b.slipDays.replace(/[^0-9]/g, '')) || 0;
      return bVal - aVal;
    });
    const start = (this.currentPage - 1) * this.pageSize;
    return sorted.slice(start, start + this.pageSize);
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  // Tooltip tracking variables
  tooltipVisible = false;
  tooltipText = '';
  tooltipStyle: any = {};

  @HostListener('mouseover', ['$event'])
  onMouseOver(event: MouseEvent) {
    const target = event.target as HTMLElement;
    const labelEl = target.closest('.gantt-y-label');
    if (labelEl) {
      const text = labelEl.getAttribute('data-tooltip');
      if (text) {
        this.tooltipText = text;
        this.tooltipVisible = true;
        this.updateTooltipPosition(event);
      }
    } else {
      this.tooltipVisible = false;
    }
  }

  @HostListener('mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    if (this.tooltipVisible) {
      this.updateTooltipPosition(event);
    }
  }

  @HostListener('mouseout', ['$event'])
  onMouseOut(event: MouseEvent) {
    const target = event.target as HTMLElement;
    const labelEl = target.closest('.gantt-y-label');
    if (labelEl) {
      this.tooltipVisible = false;
    }
  }

  private updateTooltipPosition(event: MouseEvent) {
    this.tooltipStyle = {
      left: (event.clientX + 15) + 'px',
      top: (event.clientY + 15) + 'px',
      position: 'fixed',
      zIndex: 9999
    };
  }

  selectedTimeframe: string = 'Month';
  timeframes: string[] = ['Today', 'Week', 'Month', 'Quarter'];

  // --- Highcharts Configurations ---

  // 1. Gantt Chart Options
  ganttChartOptions: Highcharts.Options = {
    // Increased marginLeft to 220 to give the labels plenty of space
    chart: { backgroundColor: 'transparent', marginLeft: 220 },
    title: { text: '' },
    credits: { enabled: false },
    xAxis: {
      min: Date.UTC(2026, 5, 1),
      max: Date.UTC(2026, 8, 30),
      tickInterval: 1000 * 60 * 60 * 24 * 30,
      labels: { format: '{value:%b}' },
      gridLineWidth: 1
    },
    yAxis: {
      type: 'category',
      reversed: true,
      title: { text: undefined },
      grid: { enabled: true, borderColor: '#f3f4f6' },
      labels: {
        align: 'left',
        // Offset labels to the left to sit inside the margin
        x: -200,
        useHTML: true,
        style: { fontSize: '11px', color: '#1f2937', fontWeight: '500' },
        formatter: function(): string {
          const categoryName = this.value as string;
          const description = sprintDescriptions[categoryName] || categoryName;
          return `<span class="gantt-y-label" data-tooltip="${description}">${description}</span>`;
        }
      },
      categories: [
        'Component Sourcing', 'Tooling & Dies', 'Assembly Line Setup', 'PLC Programming',
        'Dry Run Testing', 'First Article Inspection', 'Quality Certification', 'Mass Production Ramp'
      ]
    },
    plotOptions: {
      gantt: { borderRadius: 12, pointWidth: 16 }
    },
    series: [{
      type: 'gantt',
      name: 'Production Timeline',
      dataLabels: {
        enabled: true,
        format: '{point.custom.label}',
        style: { color: '#ffffff', textOutline: 'none', fontWeight: 'bold', fontSize: '10px' }
      },
      data: [
        { y: 0, start: Date.UTC(2026, 5, 1), end: Date.UTC(2026, 5, 17), color: '#10b981', custom: { label: '16d' } },
        { y: 1, start: Date.UTC(2026, 5, 14), end: Date.UTC(2026, 6, 8), color: '#10b981', custom: { label: '24d' } },
        { y: 2, start: Date.UTC(2026, 5, 28), end: Date.UTC(2026, 6, 26), color: '#3b82f6', custom: { label: '28d' } },
        { y: 3, start: Date.UTC(2026, 6, 15), end: Date.UTC(2026, 6, 27), color: '#ef4444', custom: { label: '12d' } },
        { y: 4, start: Date.UTC(2026, 6, 25), end: Date.UTC(2026, 7, 10), color: '#9ca3af', custom: { label: '16d' } },
        { y: 5, start: Date.UTC(2026, 7, 5), end: Date.UTC(2026, 7, 27), color: '#9ca3af', custom: { label: '22d' } },
        { y: 6, start: Date.UTC(2026, 7, 20), end: Date.UTC(2026, 8, 3), color: '#9ca3af', custom: { label: '14d' } },
        { y: 7, start: Date.UTC(2026, 8, 1), end: Date.UTC(2026, 8, 19), color: '#9ca3af', custom: { label: '18d' } }
      ]
    }]
  };

  bufferSprintData = [
    { sprint: 1, bufferUsed: 0.8, project: 'Project Alpha', stage: 'g1' },
    { sprint: 2, bufferUsed: 2.5, project: 'Project Alpha', stage: 'g2' },
    { sprint: 3, bufferUsed: 2.2, project: 'Project Alpha', stage: 'g2' },
    { sprint: 4, bufferUsed: 4.8, project: 'Project Alpha', stage: 'g3' },
    { sprint: 5, bufferUsed: 4.0, project: 'Project Alpha', stage: 'g4' },
    { sprint: 6, bufferUsed: 6.5, project: 'Project Alpha', stage: 'g5' }
  ];

  gateHeaders = [
    { key: 'g1', label: 'Gate 1' }, { key: 'g2', label: 'Gate 2' }, { key: 'g3', label: 'Gate 3' }, { key: 'g4', label: 'Gate 4' }, { key: 'g5', label: 'Gate 5' }
  ];

  // UPDATED: Buffer Bar Chart with alternating green and pink colors
  bufferBarChartOptions: Highcharts.Options = {
    chart: { type: 'column', backgroundColor: 'transparent' },
    title: { text: undefined },
    credits: { enabled: false },
    xAxis: {
      title: { text: '% completion' },
      categories: this.bufferSprintData.map(d => 'S' + d.sprint)
    },
    yAxis: {
      title: { text: 'Buffer Time Used' },
      min: 0
    },
    tooltip: { shared: false, useHTML: true },
    plotOptions: {
      column: {
        dataLabels: { enabled: true }
      }
    },
    series: [
      {
        type: 'column',
        name: 'Buffer Used',
        data: this.bufferSprintData.map((d, idx) => ({
          y: d.bufferUsed,
          stage: d.stage,
          // Alternating colors: green for even indices, pink for odd
          color: idx % 2 === 0 ? '#10b981' : '#DC3545'
        }))
      },
      {
        type: 'line',
        name: 'Average Threshold (y=x)',
        data: this.bufferSprintData.map(d => d.sprint),
        color: '#3b82f6',
        dashStyle: 'Dash',
        marker: { enabled: false }
      }
    ]
  };

  // 2. Combo Bar/Line Chart Container (Production Yield vs Planned)
  velocityChartOptions: Highcharts.Options = {
    chart: { type: 'column', backgroundColor: 'transparent' },
    title: { text: '' },
    credits: { enabled: false },
    legend: { itemMarginTop: 8, itemMarginBottom: 8 },
    xAxis: { categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'] },
    yAxis: [
      { title: { text: '' }, labels: { format: '{value}%' }, max: 8 },
      { title: { text: '' }, labels: { format: '{value}%' }, opposite: true, max: 60 }
    ],
    series: [
      { type: 'column', name: 'Completed this month', data: [6, 5, 4, 3, 2, 2, 1], color: '#ef4444', yAxis: 0 },
      { type: 'line', name: 'Total completed', data: [45, 50, 52, 55, 58, 60, 62], color: '#10b981', yAxis: 1, dashStyle: 'Dash', marker: { enabled: false } }
    ]
  };

  // 3. Bar Chart Container (Production Costs)
  costsChartOptions: Highcharts.Options = {
    chart: { type: 'column', backgroundColor: 'transparent' },
    title: { text: '' },
    credits: { enabled: false },
    legend: { itemMarginTop: 8, itemMarginBottom: 8 },
    xAxis: { categories: ['S1', 'S2', 'S3', 'S4', 'S5'] },
    yAxis: { title: { text: '' }, labels: { format: '{value}L' } },
    plotOptions: { column: { borderRadius: 2 } },
    series: [
      { type: 'column', name: 'Actual Cost', data: [11, 18, 22, 18, 24], color: '#a855f7' },
      { type: 'column', name: 'Budgeted Cost', data: [10, 20, 26, 22, 28], color: '#3b82f6' }
    ]
  };

  // 4. Line Chart Container (Supply Chain & Inventory Buffer)
  bufferChartOptions: Highcharts.Options = {
    chart: { type: 'line', backgroundColor: 'transparent' },
    title: { text: '' },
    credits: { enabled: false },
    legend: { itemMarginTop: 8, itemMarginBottom: 8 },
    xAxis: { categories: ['W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7', 'W8', 'W9', 'W10'] },
    yAxis: { title: { text: '' }, labels: { format: '{value}%' }, max: 40 },
    series: [
      { type: 'line', name: 'Buffer Consumed', data: [0, 4, 10, 18, 25, 30, 33, 35, 37, 38], color: '#f59e0b', dashStyle: 'ShortDash', marker: { symbol: 'circle' } },
      { type: 'line', name: 'Buffer Completed', data: [0, 5, 8, 12, 15, 20, 21, 23, 24, 26], color: '#10b981', dashStyle: 'ShortDash', marker: { symbol: 'circle' } }
    ]
  };

  // UPDATED: Buffer Stage Chart with dynamic coloring (green for positive, red for negative)
  bufferStageChartOptions: Highcharts.Options = {
    chart: {
      type: 'column',
      backgroundColor: 'transparent'
    },
    title: {
      text: ''
    },
    credits: {
      enabled: false
    },
    xAxis: {
      categories: this.gateHeaders.map(g => g.label)
    },
    yAxis: {
      title: {
        text: 'Variance (%)'
      }
    },
    plotOptions: {
      column: {
        dataLabels: {
          enabled: true,
          format: '{point.y}%'
        }
      }
    },
    series: [
      {
        type: 'column',
        name: 'Buffer Variance',
        data: [
          { y: 2, color: '#10b981' },   // Gate 1
          { y: -1, color: '#ef4444' },  // Gate 2
          { y: 5, color: '#10b981' },   // Gate 3
          { y: 3, color: '#10b981' },   // Gate 4
          { y: -2, color: '#ef4444' }   // Gate 5
        ]
      }
    ]
  };
  // 5. Stacked Bar Chart (Factory Expenses)
  expensesChartOptions: Highcharts.Options = {
    chart: { type: 'column', backgroundColor: 'transparent' },
    title: { text: '' },
    credits: { enabled: false },
    legend: { itemMarginTop: 10, itemMarginBottom: 10, itemDistance: 20 },
    xAxis: { categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'] },
    yAxis: { title: { text: '' }, labels: { format: '{value}L' } },
    plotOptions: { column: { stacking: 'normal', borderWidth: 0 } },
    series: [
      { type: 'column', name: 'Labour', data: [5, 8, 12, 11, 14, 10], color: '#3b82f6' },
      { type: 'column', name: 'Materials', data: [3, 6, 8, 7, 9, 7], color: '#10b981' },
      { type: 'column', name: 'Overhead', data: [2, 3, 4, 3, 4, 3], color: '#f59e0b' }
    ]
  };

  // 6. Stacked Bar Chart (Man-Hours Logged) -> Now a Pie Chart
  hoursChartOptions: Highcharts.Options = {
    chart: { type: 'pie', backgroundColor: 'transparent' },
    title: { text: '' },
    credits: { enabled: false },
    legend: { itemMarginTop: 10, itemMarginBottom: 10, itemDistance: 20 },
    tooltip: {
      pointFormat: '{series.name}: <b>{point.y} hours ({point.percentage:.1f}%)</b>'
    },
    plotOptions: {
      pie: {
        size: '80%',
        allowPointSelect: true,
        cursor: 'pointer',
        dataLabels: {
          enabled: true,
          format: '<b>{point.name}</b>: {point.percentage:.1f}%',
          distance: 15,
          style: {
            fontSize: '11px',
            fontFamily: 'inherit'
          }
        },
        showInLegend: true
      }
    },
    series: [
      {
        type: 'pie',
        name: 'Effort Hours',
        data: [
          { name: 'Production Staff', y: 2350, color: '#3b82f6' },
          { name: 'Quality Assurance', y: 480, color: '#10b981' },
          { name: 'Maintenance & Setup', y: 225, color: '#f59e0b' }
        ]
      }
    ]
  };

  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {

    this.bufferBarChartOptions = {
      chart: {
        type: 'column',
        backgroundColor: 'transparent'
      },

      title: {
        text: ''
      },

      credits: {
        enabled: false
      },

      xAxis: {
        categories: this.bufferSprintData.map(d => 'S' + d.sprint),
        title: {
          text: '% completion'
        }
      },

      yAxis: {
        min: 0,
        title: {
          text: 'Buffer Time Used'
        }
      },

      tooltip: {
        shared: false,
        useHTML: true
      },

      plotOptions: {
        column: {
          dataLabels: {
            enabled: true
          }
        }
      },

      series: [
        {
          type: 'column',
          name: 'Buffer',
          data: this.bufferSprintData.map((d, idx) => ({
            y: d.bufferUsed,
            stage: d.stage,
            color: idx % 2 === 0 ? '#10b981' : '#DC3545'
          }))
        },
        {
          type: 'line',
          name: 'Cumulative Completion ',
          data: this.bufferSprintData.map(d => d.sprint),
          color: '#3b82f6',
          dashStyle: 'Dash',
          marker: {
            enabled: false
          }
        }
      ]
    };

    this.bufferStageChartOptions = {
      chart: { type: 'column', backgroundColor: 'transparent' },
      title: { text: '' },
      credits: { enabled: false },
      xAxis: { categories: this.gateHeaders.map(g => g.label) },
      series: [
        {
          type: 'column',
          name: 'Buffer Variance',
          data: this.gateHeaders.map(g => {
            const variance = Math.round(Math.random() * 10 - 3);
            return {
              y: variance,
              stageKey: g.key,
              // Dynamic color: green for positive, red for negative
              color: variance >= 0 ? '#10b981' : '#ef4444'
            };
          })
        }
      ]
    };
    this.updateFlag = true;
  }

  setTimeframe(frame: string): void {
    this.selectedTimeframe = frame;

    switch (frame) {
      case 'Today':
        this.costsChartOptions.xAxis = { categories: ['8 AM', '10 AM', '12 PM', '2 PM', '4 PM', '6 PM'] };
        this.costsChartOptions.series = [
          { type: 'column', name: 'Actual Cost', data: [1, 2, 3, 2, 4, 3], color: '#a855f7' },
          { type: 'column', name: 'Budgeted Cost', data: [2, 2, 2, 3, 3, 4], color: '#3b82f6' }
        ];

        this.expensesChartOptions.xAxis = { categories: ['8 AM', '10 AM', '12 PM', '2 PM', '4 PM', '6 PM'] };
        this.expensesChartOptions.series = [
          { type: 'column', name: 'Direct Labour', data: [1, 1, 2, 1, 2, 1], color: '#3b82f6' },
          { type: 'column', name: 'Raw Materials', data: [0.5, 1, 1, 1, 1, 1], color: '#10b981' },
          { type: 'column', name: 'Factory Overhead', data: [0.3, 0.5, 0.5, 0.4, 0.5, 0.4], color: '#f59e0b' },
          { type: 'column', name: 'Tooling & Machining', data: [0.2, 0.2, 0.3, 0.2, 0.3, 0.2], color: '#ef4444' }
        ];

        this.hoursChartOptions.series = [
          {
            type: 'pie',
            name: 'Effort Hours',
            data: [
              { name: 'Production Staff', y: 340, color: '#3b82f6' },
              { name: 'Quality Assurance', y: 84, color: '#10b981' },
              { name: 'Maintenance & Setup', y: 45, color: '#f59e0b' }
            ]
          }
        ];
        break;

      case 'Week':
        this.costsChartOptions.xAxis = { categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] };
        this.costsChartOptions.series = [
          { type: 'column', name: 'Actual Cost', data: [2, 4, 5, 3, 4, 6, 5], color: '#a855f7' },
          { type: 'column', name: 'Budgeted Cost', data: [2, 3, 4, 4, 5, 5, 6], color: '#3b82f6' }
        ];

        this.expensesChartOptions.xAxis = { categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] };
        this.expensesChartOptions.series = [
          { type: 'column', name: 'Direct Labour', data: [1, 2, 2, 1, 2, 2, 1], color: '#3b82f6' },
          { type: 'column', name: 'Raw Materials', data: [1, 1, 2, 1, 1, 2, 1], color: '#10b981' },
          { type: 'column', name: 'Factory Overhead', data: [0.5, 0.5, 1, 0.5, 0.5, 1, 0.5], color: '#f59e0b' },
          { type: 'column', name: 'Tooling & Machining', data: [0.2, 0.2, 0.5, 0.2, 0.2, 0.5, 0.2], color: '#ef4444' }
        ];

        this.hoursChartOptions.series = [
          {
            type: 'pie',
            name: 'Effort Hours',
            data: [
              { name: 'Production Staff', y: 530, color: '#3b82f6' },
              { name: 'Quality Assurance', y: 193, color: '#10b981' },
              { name: 'Maintenance & Setup', y: 97, color: '#f59e0b' }
            ]
          }
        ];
        break;

      case 'Quarter':
        this.costsChartOptions.xAxis = { categories: ['Q1', 'Q2', 'Q3', 'Q4'] };
        this.costsChartOptions.series = [
          { type: 'column', name: 'Actual Cost', data: [51, 60, 55, 68], color: '#a855f7' },
          { type: 'column', name: 'Budgeted Cost', data: [56, 71, 65, 80], color: '#3b82f6' }
        ];

        this.expensesChartOptions.xAxis = { categories: ['Q1', 'Q2', 'Q3', 'Q4'] };
        this.expensesChartOptions.series = [
          { type: 'column', name: 'Direct Labour', data: [25, 35, 28, 40], color: '#3b82f6' },
          { type: 'column', name: 'Raw Materials', data: [17, 23, 18, 30], color: '#10b981' },
          { type: 'column', name: 'Factory Overhead', data: [9, 10, 11, 12], color: '#f59e0b' },
          { type: 'column', name: 'Tooling & Machining', data: [4, 5, 6, 7], color: '#ef4444' }
        ];

        this.hoursChartOptions.series = [
          {
            type: 'pie',
            name: 'Effort Hours',
            data: [
              { name: 'Production Staff', y: 4200, color: '#3b82f6' },
              { name: 'Quality Assurance', y: 1180, color: '#10b981' },
              { name: 'Maintenance & Setup', y: 590, color: '#f59e0b' }
            ]
          }
        ];
        break;

      default:
        this.costsChartOptions.xAxis = { categories: ['S1', 'S2', 'S3', 'S4', 'S5'] };
        this.costsChartOptions.series = [
          { type: 'column', name: 'Actual Cost', data: [11, 18, 22, 18, 24], color: '#a855f7' },
          { type: 'column', name: 'Budgeted Cost', data: [10, 20, 26, 22, 28], color: '#3b82f6' }
        ];

        this.expensesChartOptions.xAxis = { categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'] };
        this.expensesChartOptions.series = [
          { type: 'column', name: 'Direct Labour', data: [5, 8, 12, 11, 14, 10], color: '#3b82f6' },
          { type: 'column', name: 'Raw Materials', data: [3, 6, 8, 7, 9, 7], color: '#10b981' },
          { type: 'column', name: 'Factory Overhead', data: [2, 3, 4, 3, 4, 3], color: '#f59e0b' },
          { type: 'column', name: 'Tooling & Machining', data: [1, 1, 2, 2, 2, 1], color: '#ef4444' }
        ];

        this.hoursChartOptions.series = [
          {
            type: 'pie',
            name: 'Effort Hours',
            data: [
              { name: 'Production Staff', y: 2350, color: '#3b82f6' },
              { name: 'Quality Assurance', y: 480, color: '#10b981' },
              { name: 'Maintenance & Setup', y: 225, color: '#f59e0b' }
            ]
          }
        ];
    }

    this.updateFlag = false;
    setTimeout(() => {
      this.updateFlag = true;
    });
  }

  goBack(): void {
    this.router.navigateByUrl('/app/testing/projects');
  }
}