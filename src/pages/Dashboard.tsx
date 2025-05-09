
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { 
  Package, 
  Truck, 
  ClipboardList, 
  AlertTriangle,
  ArrowUp,
  ArrowDown,
  BarChart3,
} from "lucide-react";

// Mock data for dashboard
const metrics = [
  {
    title: "Total Inventory",
    value: "12,543",
    icon: Package,
    change: "+5%",
    trend: "up",
  },
  {
    title: "Pending Orders",
    value: "48",
    icon: ClipboardList,
    change: "-10%",
    trend: "down",
  },
  {
    title: "Active Shipments",
    value: "32",
    icon: Truck,
    change: "+15%",
    trend: "up",
  },
  {
    title: "Low Stock Items",
    value: "7",
    icon: AlertTriangle,
    change: "-2",
    trend: "down",
  },
];

const recentActivities = [
  { id: 1, activity: "Order #1234 was shipped", time: "10 minutes ago" },
  { id: 2, activity: "Inventory count adjusted for SKU-5678", time: "25 minutes ago" },
  { id: 3, activity: "New shipment received in Area B", time: "1 hour ago" },
  { id: 4, activity: "Low stock alert for SKU-9012", time: "3 hours ago" },
  { id: 5, activity: "Order #5678 marked as delivered", time: "5 hours ago" },
];

const Dashboard = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-1">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome to Yellow Brick Warehouse Management System
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, index) => (
          <Card key={index} className="card-hover">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {metric.title}
              </CardTitle>
              <metric.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.value}</div>
              <div className={`flex items-center text-sm ${
                metric.trend === 'up' ? 'text-green-600' : 'text-red-600'
              }`}>
                {metric.trend === 'up' ? (
                  <ArrowUp className="h-4 w-4 mr-1" />
                ) : (
                  <ArrowDown className="h-4 w-4 mr-1" />
                )}
                {metric.change}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2 card-hover">
          <CardHeader>
            <CardTitle className="text-xl">Warehouse Space Utilization</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between">
                  <div className="text-sm">Area A</div>
                  <div className="text-sm font-medium">78%</div>
                </div>
                <Progress value={78} className="mt-2 h-2" />
              </div>
              <div>
                <div className="flex items-center justify-between">
                  <div className="text-sm">Area B</div>
                  <div className="text-sm font-medium">45%</div>
                </div>
                <Progress value={45} className="mt-2 h-2" />
              </div>
              <div>
                <div className="flex items-center justify-between">
                  <div className="text-sm">Area C</div>
                  <div className="text-sm font-medium">92%</div>
                </div>
                <Progress value={92} className="mt-2 h-2" />
              </div>
              <div>
                <div className="flex items-center justify-between">
                  <div className="text-sm">Area D</div>
                  <div className="text-sm font-medium">34%</div>
                </div>
                <Progress value={34} className="mt-2 h-2" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardHeader>
            <CardTitle className="text-xl">Recent Activities</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {recentActivities.map((activity) => (
                <li key={activity.id} className="border-b pb-2 last:border-0">
                  <p className="text-sm">{activity.activity}</p>
                  <p className="text-xs text-muted-foreground">{activity.time}</p>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="card-hover">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-xl">Upcoming Deliveries</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">Order #1234</p>
                  <p className="text-sm text-muted-foreground">Expected: Today</p>
                </div>
                <div className="text-sm bg-green-100 text-green-800 py-1 px-2 rounded-full">
                  On Time
                </div>
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">Order #5678</p>
                  <p className="text-sm text-muted-foreground">Expected: Tomorrow</p>
                </div>
                <div className="text-sm bg-green-100 text-green-800 py-1 px-2 rounded-full">
                  On Time
                </div>
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">Order #9012</p>
                  <p className="text-sm text-muted-foreground">Expected: May 10</p>
                </div>
                <div className="text-sm bg-yellow-100 text-yellow-800 py-1 px-2 rounded-full">
                  Delayed
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-xl">Inventory Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">SKU-1234</p>
                  <p className="text-sm text-muted-foreground">Widget A</p>
                </div>
                <div className="text-sm bg-red-100 text-red-800 py-1 px-2 rounded-full">
                  Low Stock
                </div>
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">SKU-5678</p>
                  <p className="text-sm text-muted-foreground">Widget B</p>
                </div>
                <div className="text-sm bg-red-100 text-red-800 py-1 px-2 rounded-full">
                  Low Stock
                </div>
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">SKU-9012</p>
                  <p className="text-sm text-muted-foreground">Widget C</p>
                </div>
                <div className="text-sm bg-yellow-100 text-yellow-800 py-1 px-2 rounded-full">
                  Reorder Soon
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
