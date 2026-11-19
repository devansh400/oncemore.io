"use client";

import {
  BellIcon,
  ChevronDownIcon,
  InfoIcon,
  LayersIcon,
  MoreHorizontalIcon,
  PanelRightIcon,
  PlusIcon,
} from "lucide-react";
import type { ReactNode } from "react";
import { useState } from "react";
import { toast } from "sonner";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@oncemore-landing-page/ui/components/accordion";
import { Alert, AlertDescription, AlertTitle } from "@oncemore-landing-page/ui/components/alert";
import { Avatar, AvatarFallback, AvatarGroup } from "@oncemore-landing-page/ui/components/avatar";
import { Badge } from "@oncemore-landing-page/ui/components/badge";
import { Button } from "@oncemore-landing-page/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@oncemore-landing-page/ui/components/card";
import { Checkbox } from "@oncemore-landing-page/ui/components/checkbox";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@oncemore-landing-page/ui/components/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@oncemore-landing-page/ui/components/dropdown-menu";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@oncemore-landing-page/ui/components/empty";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@oncemore-landing-page/ui/components/field";
import { Input } from "@oncemore-landing-page/ui/components/input";
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@oncemore-landing-page/ui/components/popover";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@oncemore-landing-page/ui/components/select";
import { Separator } from "@oncemore-landing-page/ui/components/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@oncemore-landing-page/ui/components/sheet";
import { Slider } from "@oncemore-landing-page/ui/components/slider";
import { Switch } from "@oncemore-landing-page/ui/components/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@oncemore-landing-page/ui/components/table";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@oncemore-landing-page/ui/components/tabs";
import { Textarea } from "@oncemore-landing-page/ui/components/textarea";
import { ToggleGroup, ToggleGroupItem } from "@oncemore-landing-page/ui/components/toggle-group";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@oncemore-landing-page/ui/components/tooltip";
import { cn } from "@oncemore-landing-page/ui/lib/utils";

import styles from "./component-gallery.module.css";

const scenes = [
  { name: "Floating Worlds", look: "Dusk", initials: "AV", stage: "Ready" },
  { name: "Cloud Passage", look: "Bright", initials: "JM", stage: "Draft" },
  { name: "Island Approach", look: "Storm", initials: "SK", stage: "In review" },
];

const looks = [
  { value: "dusk", label: "Dusk" },
  { value: "bright", label: "Bright" },
  { value: "storm", label: "Storm" },
];

function Specimen({
  label,
  title,
  description,
  className,
  children,
}: {
  label: string;
  title: string;
  description: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <Card
      className={cn(
        "min-w-0 [--card-spacing:--spacing(5)] sm:[--card-spacing:--spacing(6)]",
        className,
      )}
    >
      <CardHeader>
        <p className="font-mono text-xs tracking-widest text-muted-foreground uppercase">{label}</p>
        <CardTitle>
          <h3>{title}</h3>
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">{children}</CardContent>
    </Card>
  );
}

export function ComponentGallery({
  bodyClassName,
  displayVariable,
}: {
  bodyClassName: string;
  displayVariable: string;
}) {
  const [density, setDensity] = useState("light");
  const [signal, setSignal] = useState(65);
  const [query, setQuery] = useState("");
  const filteredScenes = scenes.filter((scene) =>
    scene.name.toLowerCase().includes(query.trim().toLowerCase()),
  );
  const portal = cn(styles.theme, styles.popup, bodyClassName, displayVariable);

  function notify(message: string) {
    toast.custom(() => (
      <div className={cn(portal, "w-full bg-popover px-4 py-3 text-sm text-popover-foreground")}>
        {message}
      </div>
    ));
  }

  return (
    <TooltipProvider>
      <div
        className={cn(styles.theme, displayVariable, "grid gap-4 lg:grid-cols-2")}
        data-density={density}
      >
        <Specimen
          label="01 / Buttons, badge, avatar"
          title="Scene toolbar"
          description="Actions and floating controls in the same workspace."
        >
          <div className="flex flex-wrap items-center gap-2">
            <Dialog>
              <DialogTrigger render={<Button size="lg" />}>
                <PlusIcon data-icon="inline-start" /> New preview
              </DialogTrigger>
              <DialogContent className={portal}>
                <DialogHeader>
                  <DialogTitle>Create a preview?</DialogTitle>
                  <DialogDescription>
                    This is a local design demo. Nothing will be published.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <DialogClose render={<Button variant="outline" />}>Cancel</DialogClose>
                  <DialogClose render={<Button />} onClick={() => notify("Preview created.")}>
                    Create preview
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <Popover>
              <PopoverTrigger render={<Button variant="outline" size="lg" />}>
                Scene info <ChevronDownIcon data-icon="inline-end" />
              </PopoverTrigger>
              <PopoverContent className={portal} align="start">
                <PopoverHeader>
                  <PopoverTitle>Floating Worlds</PopoverTitle>
                  <PopoverDescription>
                    Five islands, three lighting looks, and one live backdrop.
                  </PopoverDescription>
                </PopoverHeader>
                <Badge variant="secondary">Preview scene</Badge>
              </PopoverContent>
            </Popover>
            <DropdownMenu>
              <DropdownMenuTrigger
                aria-label="More scene actions"
                render={<Button variant="outline" size="icon-lg" />}
              >
                <MoreHorizontalIcon />
              </DropdownMenuTrigger>
              <DropdownMenuContent className={portal} align="end">
                <DropdownMenuGroup>
                  <DropdownMenuLabel>Scene actions</DropdownMenuLabel>
                  <DropdownMenuItem onClick={() => notify("Draft duplicated.")}>
                    Duplicate draft
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => notify("Review requested.")}>
                    Request review
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
            <Tooltip>
              <TooltipTrigger
                aria-label="Preview visibility"
                render={<Button variant="ghost" size="icon-lg" />}
              >
                <InfoIcon />
              </TooltipTrigger>
              <TooltipContent className={portal}>Previews are private by default.</TooltipContent>
            </Tooltip>
          </div>
          <Separator />
          <div className="flex flex-wrap items-center gap-3">
            <AvatarGroup aria-label="Scene reviewers">
              {scenes.map((scene) => (
                <Avatar key={scene.initials}>
                  <AvatarFallback>{scene.initials}</AvatarFallback>
                </Avatar>
              ))}
            </AvatarGroup>
            <Badge variant="outline">Ready for review</Badge>
          </div>
        </Specimen>

        <Specimen
          label="02 / Field, input, select"
          title="Preview form"
          description="A small form for testing labels, inputs, and focus states."
        >
          <form
            className="flex flex-col items-start gap-4"
            onSubmit={(event) => {
              event.preventDefault();
              notify("Draft saved for this demo.");
            }}
          >
            <FieldGroup className="gap-3">
              <div className="grid gap-3 sm:grid-cols-2">
                <Field>
                  <FieldLabel htmlFor="preview-name">Preview name</FieldLabel>
                  <Input id="preview-name" name="name" defaultValue="Floating Worlds" required />
                </Field>
                <Field>
                  <FieldLabel htmlFor="preview-look">Lighting preset</FieldLabel>
                  <Select name="look" items={looks} defaultValue="dusk">
                    <SelectTrigger className="w-full" id="preview-look">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className={portal} alignItemWithTrigger={false}>
                      <SelectGroup>
                        {looks.map((look) => (
                          <SelectItem key={look.value} value={look.value}>
                            {look.label}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </Field>
              </div>
              <Field>
                <FieldLabel htmlFor="preview-notes">Review notes</FieldLabel>
                <Textarea
                  id="preview-notes"
                  name="notes"
                  placeholder="What should reviewers look at?"
                />
              </Field>
              <Field orientation="horizontal">
                <Checkbox id="preview-route" name="showRoute" defaultChecked />
                <FieldLabel htmlFor="preview-route">Include the cloud route</FieldLabel>
              </Field>
            </FieldGroup>
            <Button type="submit">Save draft</Button>
          </form>
        </Specimen>

        <Specimen
          label="03 / Switch, slider, toggle group"
          title="Surface controls"
          description="Compare both glass densities without moving the camera."
        >
          <FieldGroup className="gap-4">
            <Field>
              <FieldLabel id="gallery-density-label">Gallery density</FieldLabel>
              <ToggleGroup
                aria-labelledby="gallery-density-label"
                value={[density]}
                variant="outline"
                onValueChange={(values) => {
                  if (values[0]) setDensity(values[0]);
                }}
              >
                <ToggleGroupItem value="light">Light</ToggleGroupItem>
                <ToggleGroupItem value="dense">Dense</ToggleGroupItem>
              </ToggleGroup>
              <FieldDescription>
                {density === "light"
                  ? "30% tint for a clearer view of the scene."
                  : "60% tint for more contrast."}
              </FieldDescription>
            </Field>
            <Separator />
            <Field orientation="horizontal" className="justify-between">
              <FieldLabel htmlFor="scene-alerts">
                <BellIcon className="size-4" /> Scene alerts
              </FieldLabel>
              <Switch id="scene-alerts" defaultChecked />
            </Field>
            <Field>
              <div className="flex items-center justify-between gap-2">
                <FieldLabel>Signal level</FieldLabel>
                <output className="font-mono text-xs" aria-label="Current signal level">
                  {signal}%
                </output>
              </div>
              <Slider
                thumbLabel="Signal level"
                value={[signal]}
                onValueChange={(value) =>
                  setSignal(typeof value === "number" ? value : (value[0] ?? 0))
                }
              />
            </Field>
          </FieldGroup>
        </Specimen>

        <Specimen
          label="04 / Tabs, accordion, alert, sheet"
          title="Scene inspector"
          description="Switch between compact details and a larger overlay."
        >
          <Tabs defaultValue="overview">
            <TabsList aria-label="Scene inspector tabs">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="layers">Layers</TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="pt-2">
              <Alert>
                <LayersIcon />
                <AlertTitle>Live scene behind the gallery</AlertTitle>
                <AlertDescription>
                  Use the scene controls above to test contrast in a different look.
                </AlertDescription>
              </Alert>
            </TabsContent>
            <TabsContent value="layers" className="pt-2">
              <Accordion>
                <AccordionItem value="worlds">
                  <AccordionTrigger>Floating islands</AccordionTrigger>
                  <AccordionContent>
                    Five islands share the same camera and lighting.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="route">
                  <AccordionTrigger>Cloud route</AccordionTrigger>
                  <AccordionContent>
                    The cloud path connects the islands on the landing page.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </TabsContent>
          </Tabs>
          <Sheet>
            <SheetTrigger render={<Button variant="outline" className="self-start" />}>
              <PanelRightIcon data-icon="inline-start" /> Open inspector
            </SheetTrigger>
            <SheetContent className={portal}>
              <SheetHeader>
                <SheetTitle>Scene inspector</SheetTitle>
                <SheetDescription>A side sheet over the live artwork.</SheetDescription>
              </SheetHeader>
              <div className="flex flex-col gap-4 px-4">
                <Alert>
                  <InfoIcon />
                  <AlertTitle>Read-only preview</AlertTitle>
                  <AlertDescription>These values are sample data.</AlertDescription>
                </Alert>
                <dl className="grid grid-cols-2 gap-3 text-sm">
                  <dt className="text-muted-foreground">Scene</dt>
                  <dd>Floating Worlds</dd>
                  <dt className="text-muted-foreground">Viewpoints</dt>
                  <dd>6</dd>
                  <dt className="text-muted-foreground">Backdrop</dt>
                  <dd>Live renderer</dd>
                </dl>
              </div>
            </SheetContent>
          </Sheet>
        </Specimen>

        <Specimen
          className="lg:col-span-2"
          label="05 / Table, search, empty state"
          title="Scene library"
          description="Filter the table to see the empty state without leaving the gallery."
        >
          <Field className="sm:max-w-xs">
            <FieldLabel htmlFor="gallery-search">Search scenes</FieldLabel>
            <Input
              id="gallery-search"
              type="search"
              placeholder="Try cloud"
              value={query}
              onChange={(event) => setQuery(event.currentTarget.value)}
            />
          </Field>
          {filteredScenes.length ? (
            <Table aria-label="Scene library">
              <TableHeader>
                <TableRow>
                  <TableHead>Scene</TableHead>
                  <TableHead>Lighting</TableHead>
                  <TableHead>Stage</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredScenes.map((scene) => (
                  <TableRow key={scene.name}>
                    <TableCell>{scene.name}</TableCell>
                    <TableCell>{scene.look}</TableCell>
                    <TableCell>
                      <Badge variant={scene.stage === "Ready" ? "secondary" : "outline"}>
                        {scene.stage}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <Empty role="status">
              <EmptyHeader>
                <EmptyTitle>No scenes found</EmptyTitle>
                <EmptyDescription>Try another name.</EmptyDescription>
              </EmptyHeader>
            </Empty>
          )}
        </Specimen>
      </div>
    </TooltipProvider>
  );
}
