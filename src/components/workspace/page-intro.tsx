import type { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function PageIntro({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: string;
  description: string;
  children?: ReactNode;
}) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="gap-4">
        <Badge className="w-fit" variant="secondary">
          {eyebrow}
        </Badge>
        <div className="space-y-2">
          <CardTitle className="text-3xl">{title}</CardTitle>
          <CardDescription className="max-w-3xl text-base">
            {description}
          </CardDescription>
        </div>
      </CardHeader>
      {children ? <CardContent>{children}</CardContent> : null}
    </Card>
  );
}
