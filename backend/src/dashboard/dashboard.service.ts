import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  ParticipantsService,
  ParticipantsStats,
} from '../participants/participants.service';
import {
  CheckinsService,
  CheckinLogView,
  CheckinsStats,
} from '../checkins/checkins.service';

export interface DashboardOverview {
  participants: ParticipantsStats;
  checkins: {
    totals: CheckinsStats;
    recent: CheckinLogView[];
  };
  tools: DashboardTool[];
}

export interface DashboardTool {
  key: string;
  name: string;
  description: string;
  href: string;
  category: 'attendance' | 'automation' | 'reports' | 'management';
}

@Injectable()
export class DashboardService {
  constructor(
    private readonly participantsService: ParticipantsService,
    private readonly checkinsService: CheckinsService,
    private readonly configService: ConfigService,
  ) {}

  async getOverview(): Promise<DashboardOverview> {
    const [participants, checkinsTotals, recent] = await Promise.all([
      this.participantsService.stats(),
      this.checkinsService.stats(),
      this.checkinsService.findRecent(10),
    ]);

    return {
      participants,
      checkins: {
        totals: checkinsTotals,
        recent,
      },
      tools: this.buildTools(),
    };
  }

  async resetData(): Promise<void> {
    await this.checkinsService.resetAll();
  }

  private buildTools(): DashboardTool[] {
    const n8nUrl =
      this.configService.get('N8N_DASHBOARD_URL') ?? 'http://localhost:5678';

    return [
      {
        key: 'scan',
        name: 'Điểm danh sự kiện',
        description:
          'Mở camera hoặc máy quét để điểm danh người tham gia trong thời gian thực.',
        href: '/attendance/scan',
        category: 'attendance',
      },
      {
        key: 'attendance-dashboard',
        name: 'Theo dõi trạng thái điểm danh',
        description:
          'Xem thống kê tổng quan và lịch sử quét gần nhất của toàn bộ sự kiện.',
        href: '/attendance/dashboard',
        category: 'reports',
      },
      {
        key: 'user-management',
        name: 'Quản lý người dùng',
        description:
          'Quản trị tài khoản, vai trò, quyền hạn và các phiên đăng nhập API.',
        href: '/admin/users',
        category: 'management',
      },
      {
        key: 'n8n',
        name: 'Automation (n8n)',
        description:
          'Quản lý workflow tự động gửi thông báo và đồng bộ dữ liệu.',
        href: n8nUrl,
        category: 'automation',
      },
    ];
  }
}
