import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PageIntro } from "@/components/workspace/page-intro";

type PreviewTable = {
  columns: readonly string[];
  rows: readonly (readonly string[])[];
};

type Section = {
  title: string;
  description: string;
  items?: readonly string[];
  table?: PreviewTable;
  note?: string;
};

export function RoutePage({
  eyebrow,
  title,
  description,
  sections,
}: {
  eyebrow: string;
  title: string;
  description: string;
  sections: readonly Section[];
}) {
  return (
    <div className="space-y-6">
      <PageIntro eyebrow={eyebrow} title={title} description={description} />

      <div className="grid gap-6 lg:grid-cols-2">
        {sections.map((section) => (
          <Card key={section.title}>
            <CardHeader>
              <CardTitle>{section.title}</CardTitle>
              <CardDescription>{section.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {section.items?.length ? (
                <div className="space-y-2">
                  {section.items.map((item) => (
                    <div
                      key={item}
                      className="rounded-2xl border border-border/70 bg-background/70 px-4 py-3 text-sm"
                    >
                      {item}
                    </div>
                  ))}
                </div>
              ) : null}

              {section.table ? (
                <div className="rounded-2xl border border-border/70 bg-background/70 p-2">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        {section.table.columns.map((column) => (
                          <TableHead key={column}>{column}</TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {section.table.rows.map((row, index) => (
                        <TableRow key={`${section.title}-${index}`}>
                          {row.map((cell, cellIndex) => (
                            <TableCell key={`${cell}-${cellIndex}`}>
                              {cell}
                            </TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : null}

              {section.note ? <Badge variant="outline">{section.note}</Badge> : null}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
