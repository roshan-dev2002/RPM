import {
  Component,
  OnInit,
  AfterViewInit,
  ChangeDetectorRef,
} from "@angular/core";
import * as Highcharts from "highcharts";

import HC_xrange from "highcharts/modules/xrange";
HC_xrange(Highcharts);

type DashboardKey = "resp" | "category" | "ageing" | "rpn";

@Component({
  selector: "app-testdashboard",
  templateUrl: "./testdashboard.component.html",
  styleUrls: ["./testdashboard.component.scss"],
})
export class TestdashboardComponent implements OnInit, AfterViewInit {
  activeDashboard: DashboardKey = "resp";
  currentView: "graph" | "grid" = "graph";

  getSprintLabel(num: number): string {
    if (num === 0) return 'Start';
    return '1' + String.fromCharCode(64 + num); // 1 -> '1A', 2 -> '1B', 3 -> '1C', ...
  }

  dashboards: Array<{ key: DashboardKey; title: string; color: string }> = [
    { key: "resp", title: "Portfolio", color: "#ffeadb" },
    { key: "category", title: "Timeline", color: "#e2f6d3" },
    { key: "ageing", title: "Budget", color: "#d7f3ff" },
    { key: "rpn", title: "Buffer", color: "#fddff1" },
  ];

  // --- GATE Selection Logic ---
  selectedGate: string = "Gate 0";

  gatePieDataMap: any = {
    'Gate 0': [
      { name: 'Evaluation', y: 4, color: '#3366cc' }, { name: 'Pending', y: 3, color: '#808b96' },
      { name: 'Stop', y: 2, color: '#e74c3c' }, { name: 'Rework', y: 4, color: '#f39c12' },
      { name: 'Go', y: 7, color: '#2ecc71' }
    ],
    'Gate 1': [
      { name: 'Evaluation', y: 6, color: '#3366cc' }, { name: 'Pending', y: 1, color: '#808b96' },
      { name: 'Stop', y: 0, color: '#e74c3c' }, { name: 'Rework', y: 2, color: '#f39c12' },
      { name: 'Go', y: 11, color: '#2ecc71' }
    ],
    'Gate 2': [
      { name: 'Evaluation', y: 2, color: '#3366cc' }, { name: 'Pending', y: 5, color: '#808b96' },
      { name: 'Stop', y: 3, color: '#e74c3c' }, { name: 'Rework', y: 1, color: '#f39c12' },
      { name: 'Go', y: 9, color: '#2ecc71' }
    ],
    'default': [
      { name: 'Evaluation', y: 5, color: '#3366cc' }, { name: 'Pending', y: 4, color: '#808b96' },
      { name: 'Stop', y: 1, color: '#e74c3c' }, { name: 'Rework', y: 3, color: '#f39c12' },
      { name: 'Go', y: 7, color: '#2ecc71' }
    ]
  };

  selectedPhoneCategory: string = "Distribution";
  selectedRpnCategory: string = "Distribution";

  constructor(private cdr: ChangeDetectorRef) { }

  // --- Gantt filter state ---
  selectedProject = 'All Projects';
  projects = ['All Projects'];
  selectedStageFilter = 'all';
  filteredGanttData: any[] = [];
  selectedBudgetProject = 'All Projects';
  filteredBudgetGanttData: any[] = [];

  // --- Buffer filter state ---
  selectedBufferProject = 'All Projects';
  selectedBufferStage = 'all';
  filteredBufferSprintData: any[] = [];

  // --- Buffer chart interaction state ---
  bufferBarChart: Highcharts.Chart | null = null;
  bufferStageChart: Highcharts.Chart | null = null;
  selectedStageDrilldown: string | null = null;

  // Gate/Sprint header structure
  gateHeaders = [
    { key: 'g0', label: 'Gate 0', subtitle: 'Project Initiation', sprints: ['Sprint 0.1'] },
    { key: 'g1', label: 'Gate 1', subtitle: 'Concept Development', sprints: ['Sprint 1.1', 'Sprint 1.2'] },
    { key: 'g2', label: 'Gate 2', subtitle: 'Feasibility Study', sprints: ['Sprint 2.1', 'Sprint 2.2', 'Sprint 2.3'] },
    { key: 'g3', label: 'Gate 3', subtitle: 'Detailed Planning', sprints: ['Sprint 3.1', 'Sprint 3.2'] },
    { key: 'g4', label: 'Gate 4', subtitle: 'Design & Development', sprints: ['Sprint 4.1', 'Sprint 4.2', 'Sprint 4.3'] },
    { key: 'g5', label: 'Gate 5', subtitle: 'Validation & Testing', sprints: ['Sprint 5.1', 'Sprint 5.2'] },
  ];

  // Timeline Gantt data
  ganttData = [
    { task: '0. Project Initiation (Gate 0)', start: Date.UTC(2024, 4, 1), end: Date.UTC(2024, 4, 7), completion: 100, gate: 'g0' },
    { task: '1. Concept Development (Gate 1)', start: Date.UTC(2024, 4, 8), end: Date.UTC(2024, 4, 21), completion: 100, gate: 'g1' },
    { task: '2. Feasibility Study (Gate 2)', start: Date.UTC(2024, 4, 22), end: Date.UTC(2024, 5, 11), completion: 75, gate: 'g2' },
    { task: '3. Detailed Planning (Gate 3)', start: Date.UTC(2024, 5, 12), end: Date.UTC(2024, 6, 2), completion: 40, gate: 'g3' },
    { task: '4. Design & Development (Gate 4)', start: Date.UTC(2024, 6, 3), end: Date.UTC(2024, 6, 23), completion: 20, gate: 'g4' },
    { task: '5. Validation & Testing (Gate 5)', start: Date.UTC(2024, 6, 24), end: Date.UTC(2024, 7, 13), completion: 0, gate: 'g5' },
    { task: '6. Launch Preparation', start: Date.UTC(2024, 7, 14), end: Date.UTC(2024, 7, 27), completion: 0, gate: 'g5' },
    { task: '7. Project Closure', start: Date.UTC(2024, 7, 28), end: Date.UTC(2024, 8, 3), completion: 0, gate: 'g5' },
  ];

  // Budget Gantt data
  budgetGanttData = [
    { task: 'Feasibility', start: Date.UTC(2024, 4, 1), end: Date.UTC(2024, 4, 7), allocated: 50000, spent: 48000, completion: 96, project: 'All Projects' },
    { task: 'Prototyping', start: Date.UTC(2024, 4, 8), end: Date.UTC(2024, 4, 21), allocated: 80000, spent: 75000, completion: 94, project: 'All Projects' },
    { task: 'Design', start: Date.UTC(2024, 4, 22), end: Date.UTC(2024, 5, 11), allocated: 120000, spent: 95000, completion: 79, project: 'All Projects' },
    { task: 'Implementation', start: Date.UTC(2024, 5, 12), end: Date.UTC(2024, 6, 23), allocated: 200000, spent: 110000, completion: 55, project: 'All Projects' },
    { task: 'Testing', start: Date.UTC(2024, 6, 24), end: Date.UTC(2024, 7, 13), allocated: 60000, spent: 72000, completion: 120, project: 'All Projects' },
    { task: 'Deployment', start: Date.UTC(2024, 7, 14), end: Date.UTC(2024, 7, 27), allocated: 40000, spent: 5000, completion: 13, project: 'All Projects' },
    { task: 'Launch', start: Date.UTC(2024, 7, 28), end: Date.UTC(2024, 8, 30), allocated: 30000, spent: 0, completion: 0, project: 'All Projects' },
  ];

  // --- Ageing Data ---
  ageingHeaders: string[] = ["Period", "Issues"];
  ageingData = [
    { PERIOD: "0-10", ISSUES: 15 }, { PERIOD: "10-20", ISSUES: 12 },
    { PERIOD: "20-30", ISSUES: 7 }, { PERIOD: "30-40", ISSUES: 5 },
    { PERIOD: "40-50", ISSUES: 15 }, { PERIOD: "50-100", ISSUES: 10 },
    { PERIOD: "100+", ISSUES: 30 },
  ];

  // --- Buffer Data ---
  bufferSprintData = [
    { sprint: 1, bufferUsed: 0.8, project: 'All Projects', stage: 'g1' },
    { sprint: 2, bufferUsed: 2.5, project: 'All Projects', stage: 'g2' },
    { sprint: 3, bufferUsed: 2.2, project: 'All Projects', stage: 'g2' },
    { sprint: 4, bufferUsed: 4.8, project: 'All Projects', stage: 'g3' },
    { sprint: 5, bufferUsed: 4.0, project: 'All Projects', stage: 'g4' },
    { sprint: 6, bufferUsed: 6.5, project: 'All Projects', stage: 'g5' },

    { sprint: 1, bufferUsed: 0.5, project: 'All Projects', stage: 'g1' },
    { sprint: 2, bufferUsed: 1.2, project: 'All Projects', stage: 'g2' },
    { sprint: 3, bufferUsed: 3.0, project: 'All Projects', stage: 'g2' },
    { sprint: 4, bufferUsed: 2.9, project: 'All Projects', stage: 'g3' },
    { sprint: 5, bufferUsed: 5.5, project: 'All Projects', stage: 'g4' },
    { sprint: 6, bufferUsed: 7.1, project: 'All Projects', stage: 'g5' },
  ];

  // ─── Tooltip State ────────────────────────────────────────────────────────

  tooltipVisible = false;
  tooltipX = 0;
  tooltipY = 0;
  tooltipData: any = null;

  showTooltip(event: MouseEvent, item: any) {
    this.tooltipData = item;
    this.tooltipVisible = true;
    this.updateTooltipPosition(event);
  }

  moveTooltip(event: MouseEvent) {
    this.updateTooltipPosition(event);
  }

  hideTooltip() {
    this.tooltipVisible = false;
    this.tooltipData = null;
  }

  private updateTooltipPosition(event: MouseEvent) {
    const offset = 14;
    const tooltipWidth = 260;
    const x = event.clientX + offset;
    // flip left if near right edge
    this.tooltipX = x + tooltipWidth > window.innerWidth ? event.clientX - tooltipWidth - offset : x;
    this.tooltipY = event.clientY + offset;
  }

  // ─── Lifecycle ────────────────────────────────────────────────────────────

  ngOnInit(): void {
    this.filteredGanttData = [...this.ganttData];
    this.applyBudgetFilter();
    this.applyBufferFilter();
  }

  ngAfterViewInit(): void {
    this.cdr.detectChanges();
    this.renderChartWithDelay();
  }

  // ─── Dashboard / View control ─────────────────────────────────────────────

  setActiveDashboard(key: DashboardKey) {
    this.activeDashboard = key;
    this.renderChartWithDelay();
  }

  setView(view: "graph" | "grid") {
    this.currentView = view;
    this.renderChartWithDelay();
  }

  renderChartWithDelay() {
    setTimeout(() => this.renderActiveChart(), 0);
  }

  setGateCategory(gate: string) {
    this.selectedGate = gate;
    this.renderPortfolioSummaryChart();
  }

  setPhoneCategory(category: string) {
    this.selectedPhoneCategory = category;
    this.renderChartWithDelay();
  }

  setRpnCategory(category: string) {
    this.selectedRpnCategory = category;
    this.renderChartWithDelay();
  }

  renderActiveChart() {
    switch (this.activeDashboard) {
      case "resp": this.renderRespChart(); break;
      case "category": this.renderGanttChart(); break;
      case "ageing": this.renderBudgetGanttChart(); break;
      case "rpn": this.renderRpnChart(); break;
    }
  }

  // ─── Gantt helpers ────────────────────────────────────────────────────────

  applyGanttFilter() {
    this.filteredGanttData = this.selectedStageFilter === 'all'
      ? [...this.ganttData]
      : this.ganttData.filter(d => d.gate === this.selectedStageFilter);
  }

  isSprintInRange(item: any, gateKey: string, _sprint: string): boolean {
    return item.gate === gateKey;
  }

  getBarColor(pct: number): string {
    if (pct >= 75) return '#28a745';
    if (pct > 0 && pct < 40) return '#dc3545';
    if (pct > 0) return '#f4a300';
    return '#adb5bd';
  }

  getDarkBarColor(pct: number): string {
    if (pct >= 75) return '#1a6b31';
    if (pct > 0 && pct < 40) return '#a0212b';
    if (pct > 0) return '#c47e00';
    return '#888';
  }

  // ─── Portfolio Dashboard ──────────────────────────────────────────────────

  renderRespChart() {
    this.renderPortfolioStatusChart();
    this.renderPortfolioSummaryChart();
  }

  renderPortfolioStatusChart() {
    const containerId = 'portfolioStatusChartContainer';
    if (!document.getElementById(containerId)) return;

    Highcharts.chart(containerId, {
      chart: { type: 'column' },
      title: { text: 'Portfolio Project Status', style: { fontWeight: 'bold' } },
      subtitle: { text: 'Total Projects: 7' },
      credits: { enabled: false },
      xAxis: { categories: ['On Time', 'Delayed'], lineWidth: 1 },
      yAxis: { min: 0, max: 6, tickInterval: 1, title: { text: 'Number of Projects' }, gridLineDashStyle: 'Dash' },
      tooltip: { pointFormat: '<b>{point.name}</b>: {point.y} Projects' },
      plotOptions: { column: { grouping: false, dataLabels: { enabled: true, style: { fontWeight: 'bold', fontSize: '14px' } } } },
      series: [
        { type: 'column', name: 'On Time (5)', color: '#00a859', data: [{ x: 0, y: 5, color: '#00a859' }] },
        { type: 'column', name: 'Delayed (2)', color: '#ed1c24', data: [{ x: 1, y: 2, color: '#ed1c24' }] },
      ],
    } as any);
  }

  renderPortfolioSummaryChart() {
    const containerId = 'portfolioSummaryPieChartContainer';
    if (!document.getElementById(containerId)) return;

    const pieDataForGate = this.gatePieDataMap[this.selectedGate] || this.gatePieDataMap['default'];

    Highcharts.chart(containerId, {
      chart: { type: 'pie' },
      title: { text: `${this.selectedGate} - Portfolio Summary`, align: 'left', style: { fontSize: '16px', fontWeight: 'bold' } },
      credits: { enabled: false },
      tooltip: { pointFormat: '{series.name}: <b>{point.y}</b> ({point.percentage:.1f}%)' },
      plotOptions: {
        pie: {
          allowPointSelect: true, cursor: 'pointer', showInLegend: true,
          dataLabels: {
            enabled: true,
            format: '<div style="text-align:center"><b>{point.y}</b><br/>({point.percentage:.0f}%)</div>',
            distance: -40, useHTML: true,
            style: { color: 'white', textOutline: 'none', fontSize: '14px' },
          },
        },
      },
      legend: {
        align: 'right', verticalAlign: 'middle', layout: 'vertical',
        itemMarginTop: 10, itemMarginBottom: 10, useHTML: true,
        labelFormatter: function () {
          // @ts-ignore
          return `<span style="width:80px;display:inline-block">${this.name}</span> <span style="font-weight:bold">${this.y}</span>`;
        },
      },
      series: [{ type: 'pie', name: 'Projects', innerSize: '0%', data: pieDataForGate }],
    } as any);
  }

  // ─── Timeline Gantt Chart ─────────────────────────────────────────────────

  renderGanttChart() {
    const containerId = 'ganttChartContainer';
    if (!document.getElementById(containerId)) return;

    Highcharts.chart(containerId, {
      chart: { type: 'xrange', height: 400 },
      title: { text: 'Project Timeline' },
      credits: { enabled: false },
      xAxis: { type: 'datetime' },
      yAxis: { title: { text: 'Project Stages' }, categories: this.ganttData.map(x => x.task), reversed: true },
      tooltip: {
        pointFormat: '<b>{point.task}</b><br>Start: {point.x:%e %b %Y}<br>End: {point.x2:%e %b %Y}<br>Progress: {point.completion}%',
      },
      plotOptions: { xrange: { borderRadius: 3 } },
      series: [{
        type: 'xrange', name: 'Phases', pointWidth: 24,
        data: this.ganttData.map((item, index) => ({
          x: item.start, x2: item.end, y: index,
          color: item.completion >= 75 ? '#28a745' : (item.completion > 0 ? '#f4a300' : '#adb5bd'),
          partialFill: {
            amount: item.completion / 100,
            fill: item.completion >= 75 ? '#218838' : (item.completion > 0 ? '#d39e00' : '#868e96'),
          },
          task: item.task, completion: item.completion,
        })),
      } as any],
    });
  }

  applyBufferFilter() {
    this.filteredBufferSprintData = this.bufferSprintData.filter(d => {
      const matchesProject = d.project === this.selectedBufferProject;
      const matchesStage = this.selectedBufferStage === 'all' || d.stage === this.selectedBufferStage;
      return matchesProject && matchesStage;
    });
  }

  onBufferFilterChange() {
    this.selectedStageDrilldown = null;
    this.applyBufferFilter();
    this.renderRpnChart();
  }

  // ─── Budget Gantt Chart ───────────────────────────────────────────────────

  renderBudgetGanttChart() {
    const containerId = 'budgetGanttChartContainer';
    if (!document.getElementById(containerId)) return;

    Highcharts.chart(containerId, {
      chart: { type: 'xrange', height: 400 },
      title: { text: 'Budget Utilization by Stage' },
      credits: { enabled: false },
      xAxis: { type: 'datetime' },
      yAxis: { title: { text: 'Phases' }, categories: this.filteredBudgetGanttData.map(x => x.task), reversed: true },
      tooltip: {
        pointFormat: '<b>{point.task}</b><br>Allocated: ${point.allocated}<br>Spent: ${point.spent}<br>Used: {point.completion}%',
      },
      plotOptions: { xrange: { borderRadius: 3 } },
      series: [{
        type: 'xrange', name: 'Budget', pointWidth: 24,
        data: this.filteredBudgetGanttData.map((item, index) => ({
          x: item.start, x2: item.end, y: index,
          color: item.completion > 100 ? '#f8d7da' : (item.completion > 80 ? '#fff3cd' : '#d4edda'),
          partialFill: {
            amount: Math.min(item.completion / 100, 1),
            fill: item.completion > 100 ? '#dc3545' : (item.completion > 80 ? '#f4a300' : '#28a745'),
          },
          task: item.task, allocated: item.allocated, spent: item.spent, completion: item.completion,
        })),
      } as any],
    });
  }

  applyBudgetFilter() {
    this.filteredBudgetGanttData = this.budgetGanttData.filter(
      d => d.project === this.selectedBudgetProject
    );
  }

  onBudgetProjectChange() {
    this.applyBudgetFilter();
    this.renderBudgetGanttChart();
  }

  // ─── Buffer Charts ────────────────────────────────────────────────────────

  renderRpnChart() {
    this.renderBufferBarChart();
    this.renderBufferPieChart();
  }

  renderBufferBarChart() {
    const containerId = 'bufferBarChartContainer';
    if (!document.getElementById(containerId)) return;

    const dataSource = this.selectedStageDrilldown
      ? this.filteredBufferSprintData.filter(d => d.stage === this.selectedStageDrilldown)
      : this.filteredBufferSprintData;

    const maxSprint = Math.max(...dataSource.map(d => d.sprint), 5);
    const lineData: [number, number][] = [];
    for (let i = 0; i <= maxSprint + 1; i++) lineData.push([i, i]);

    const columnData = dataSource.map(d => ({
      x: d.sprint,
      y: d.bufferUsed,
      color: d.bufferUsed > d.sprint ? '#dc3545' : '#28a745',
      status: d.bufferUsed > d.sprint ? 'Over Budget' : 'On Track',
      stage: d.stage
    }));

    const self = this;
    const stageLabel = this.selectedStageDrilldown
      ? this.gateHeaders.find(g => g.key === this.selectedStageDrilldown)?.label
      : null;

    this.bufferBarChart = Highcharts.chart(containerId, {
      chart: { type: 'column' },
      title: {
        text: stageLabel
          ? `Buffer Consumed vs % Completion — ${stageLabel}`
          : 'Buffer Consumed vs % Completion'
      },
      subtitle: stageLabel ? { text: 'Click the stage chart bar again to clear this filter' } : undefined,
      credits: { enabled: false },
      xAxis: {
        title: { text: '% completion' },
        min: 0,
        tickInterval: 1,
        labels: {
          formatter: function () {
            return self.getSprintLabel(this.value as number);
          }
        }
      },
      yAxis: { title: { text: 'Buffer Time Used' }, min: 0 },
      tooltip: {
        shared: false,
        useHTML: true,
        formatter: function () {
          const sprintName = self.getSprintLabel(this.x as number);
          if (this.series.name === 'Average Threshold (y=x)') {
            return `<b>Average Threshold</b><br/>${sprintName}<br/>Expected Buffer: ${this.y}`;
          }
          return `
            <div style="font-size: 13px; color: #333;">
              <b>${sprintName}</b><br/>
              <span style="color: ${this.point.color}">\u25CF</span> Buffer Used: <b>${this.y}</b><br/>
              Status: <i>${(this.point as any).options.status}</i>
            </div>
          `;
        }
      },
      plotOptions: {
        column: {
          point: {
            events: {
              mouseOver: function () {
                const stage = (this as any).options.stage;
                const stageChart = self.bufferStageChart;
                if (!stageChart) return;
                stageChart.series[0].points.forEach(p => {
                  if ((p as any).stageKey === stage) p.setState('hover');
                });
              },
              mouseOut: function () {
                const stageChart = self.bufferStageChart;
                if (!stageChart) return;
                stageChart.series[0].points.forEach(p => p.setState(''));
              }
            }
          }
        }
      },
      series: [
        { type: 'column', name: 'Buffer Used', data: columnData, dataLabels: { enabled: true, format: '{point.y}' } },
        { type: 'line', name: 'Average Threshold (y=x)', data: lineData, color: '#007bff', dashStyle: 'Dash', marker: { enabled: false }, enableMouseTracking: true },
      ],
    } as any);
  }

  renderBufferPieChart() {
    const containerId = 'bufferPieChartContainer';
    if (!document.getElementById(containerId)) return;

    const stageOrder = new Map<string, number>();
    this.gateHeaders.forEach((g, i) => stageOrder.set(g.key, i + 1));

    const stageMap = new Map<string, { actualTotal: number; count: number }>();
    this.filteredBufferSprintData.forEach(d => {
      const entry = stageMap.get(d.stage) || { actualTotal: 0, count: 0 };
      entry.actualTotal += d.bufferUsed;
      entry.count += 1;
      stageMap.set(d.stage, entry);
    });

    // UPDATED: Simplified color logic - green for positive, red for negative
    const stageData = this.gateHeaders
      .filter(g => stageMap.has(g.key))
      .map(g => {
        const entry = stageMap.get(g.key)!;
        const avgActual = entry.actualTotal / entry.count;
        const expected = stageOrder.get(g.key)!;
        // Variance relative to expected baseline (savings / under budget is positive/green)
        const variancePct = +(((expected - avgActual) / expected) * 100).toFixed(1);
        return {
          name: g.label,
          y: variancePct,
          avgActual: +avgActual.toFixed(2),
          expected,
          stageKey: g.key,
          // Favorable variance (saved buffer / on track) is green
          color: variancePct >= 0 ? '#00a859' : '#dc3545'
        };
      });

    const self = this;

    this.bufferStageChart = Highcharts.chart(containerId, {
      chart: { type: 'column' },
      title: { text: 'Buffer Stage-wise Distribution' },
      subtitle: { text: 'Click a bar to drill into that stage\'s sprints' },
      credits: { enabled: false },
      xAxis: {
        categories: stageData.map(s => s.name),
        lineWidth: 1,
        lineColor: '#1b2e5e',
        gridLineWidth: 0
      },
      yAxis: {
        title: { text: 'Variance (%)' },
        gridLineWidth: 0,
        lineWidth: 1,
        lineColor: '#1b2e5e',
        plotLines: [{ value: 0, width: 2, color: '#1b2e5e', zIndex: 4 }]
      },
      tooltip: {
        useHTML: true,
        formatter: function () {
          const p = this.point as any;
          const status = p.y >= 0 ? 'Favorable (On Track / Saved Buffer)' : 'Unfavorable (Over Buffer)';
          return `
            <div style="font-size: 13px;">
              <b>${this.key}</b><br/>
              Avg Buffer Used: <b>${p.avgActual}</b><br/>
              Expected Baseline: <b>${p.expected}</b><br/>
              Variance: <b>${p.y}%</b><br/>
              <i>${status}</i>
            </div>
          `;
        }
      },
      plotOptions: {
        column: {
          borderRadius: 3,
          borderWidth: 1,
          borderColor: '#000000',
          cursor: 'pointer',
          dataLabels: {
            enabled: true,
            format: '{point.y}%',
            style: { fontWeight: 'bold', color: '#333' }
          },
          point: {
            events: {
              click: function () {
                const stageKey = (this as any).stageKey;
                self.selectedStageDrilldown = self.selectedStageDrilldown === stageKey ? null : stageKey;
                self.renderBufferBarChart();
              },
              mouseOver: function () {
                const stageKey = (this as any).stageKey;
                const barChart = self.bufferBarChart;
                if (!barChart) return;
                barChart.series[0].points.forEach(p => {
                  if ((p as any).options.stage === stageKey) p.setState('hover');
                });
              },
              mouseOut: function () {
                const barChart = self.bufferBarChart;
                if (!barChart) return;
                barChart.series[0].points.forEach(p => p.setState(''));
              }
            }
          }
        }
      },
      series: [{
        type: 'column',
        name: 'Buffer Variance',
        data: stageData
      }],
    } as any);
  }
}