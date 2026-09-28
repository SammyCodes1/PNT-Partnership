import {
  AlignmentType,
  BorderStyle,
  Document,
  Packer,
  PageOrientation,
  Paragraph,
  ShadingType,
  Table,
  TableCell,
  TableRow,
  TextRun,
  VerticalAlign,
  WidthType,
} from "docx"
import { Fragment, useEffect, useMemo, useState } from "react"
import type { FormEvent } from "react"
import { Button } from "../components/ui/Button.tsx"
import { AREAS_OF_PARTNERSHIP, PARTNERSHIP_TYPES } from "../lib/partnership.ts"
import { supabase } from "../lib/supabase.ts"

type PartnerRow = {
  id: string
  created_at: string
  full_name: string
  email: string
  phone: string
  location: string | null
  partnership_type: string
  pledge_frequency: string | null
  area_of_partnership: string
  amount: number | string | null
  payment_method: string | null
  is_anonymous: boolean | null
  message: string | null
}

const columns = [
  "Date",
  "Full Name",
  "Phone",
  "Email",
  "Location",
  "Partnership Type",
  "Frequency",
  "Amount",
  "Area",
  "Payment Method",
  "Anonymous",
] as const

function formatDate(value: string) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ""
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date)
}

function amountText(value: PartnerRow["amount"]) {
  if (value == null || value === "") return ""
  const amount = Number(value)
  return Number.isFinite(amount) ? String(amount) : ""
}

function formatCurrency(value: PartnerRow["amount"]) {
  if (value == null || value === "") return "-"
  const amount = Number(value)
  if (!Number.isFinite(amount)) return String(value)
  return "₦" + amount.toLocaleString("en-NG", { minimumFractionDigits: 0, maximumFractionDigits: 2 })
}

function anonymousText(value: boolean | null) {
  return value ? "Yes" : "No"
}

function cells(partner: PartnerRow) {
  return [
    formatDate(partner.created_at),
    partner.full_name,
    partner.phone,
    partner.email,
    partner.location ?? "",
    partner.partnership_type,
    partner.pledge_frequency ?? "",
    amountText(partner.amount),
    partner.area_of_partnership,
    partner.payment_method ?? "",
    anonymousText(partner.is_anonymous),
  ]
}

function csvCell(value: string) {
  if (/[",\n]/.test(value)) return `"${value.replaceAll('"', '""')}"`
  return value
}

const tableBorders = {
  top: { style: BorderStyle.SINGLE, size: 6, color: "CBD5E1" },
  bottom: { style: BorderStyle.SINGLE, size: 6, color: "CBD5E1" },
  left: { style: BorderStyle.SINGLE, size: 4, color: "E2E8F0" },
  right: { style: BorderStyle.SINGLE, size: 4, color: "E2E8F0" },
  insideHorizontal: { style: BorderStyle.SINGLE, size: 4, color: "E2E8F0" },
  insideVertical: { style: BorderStyle.SINGLE, size: 4, color: "E2E8F0" },
}

type CellOptions = {
  bold?: boolean
  color?: string
  size?: number
  fill?: string
  align?: (typeof AlignmentType)[keyof typeof AlignmentType]
  widthDxa?: number
  colSpan?: number
}

function createDocxCell(content: string | Paragraph[], options: CellOptions = {}) {
  const {
    bold = false,
    color = "1E293B",
    size = 18,
    fill = undefined,
    align = AlignmentType.LEFT,
    widthDxa = undefined,
    colSpan = undefined,
  } = options

  const children: Paragraph[] = Array.isArray(content)
    ? content
    : [
        new Paragraph({
          alignment: align,
          spacing: { before: 20, after: 20 },
          children: [
            new TextRun({
              text: content || "-",
              bold,
              color,
              size,
              font: "Calibri",
            }),
          ],
        }),
      ]

  return new TableCell({
    width: widthDxa ? { size: widthDxa, type: WidthType.DXA } : undefined,
    columnSpan: colSpan,
    shading: fill ? { fill, type: ShadingType.CLEAR } : undefined,
    margins: { top: 130, bottom: 130, left: 140, right: 140 },
    verticalAlign: VerticalAlign.CENTER,
    children,
  })
}

async function downloadDocx(rows: PartnerRow[]) {
  const today = new Date()
  const dateFormatted = new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(today)

  // 1. Calculate summary breakdown by Area of Partnership so all areas are visibly displayed
  const areaMap = new Map<string, { count: number; recurring: number; onetime: number; totalAmount: number }>()

  for (const standardArea of AREAS_OF_PARTNERSHIP) {
    areaMap.set(standardArea, { count: 0, recurring: 0, onetime: 0, totalAmount: 0 })
  }

  let grandTotalCount = 0
  let grandTotalAmount = 0

  for (const partner of rows) {
    const areaKey = partner.area_of_partnership?.trim() || "Unspecified"
    const stat = areaMap.get(areaKey) || { count: 0, recurring: 0, onetime: 0, totalAmount: 0 }
    stat.count += 1
    if (partner.partnership_type === "Recurring Partner") {
      stat.recurring += 1
    } else {
      stat.onetime += 1
    }
    const num = Number(partner.amount)
    if (Number.isFinite(num)) {
      stat.totalAmount += num
      grandTotalAmount += num
    }
    grandTotalCount += 1
    areaMap.set(areaKey, stat)
  }

  // Summary Table: Header
  const summaryHeader = new TableRow({
    tableHeader: true,
    children: [
      createDocxCell("Area of Partnership", { bold: true, color: "FFFFFF", fill: "1E293B", size: 19, widthDxa: 4500 }),
      createDocxCell("Total Partners", { bold: true, color: "FFFFFF", fill: "1E293B", size: 19, align: AlignmentType.CENTER, widthDxa: 2500 }),
      createDocxCell("Pledge Breakdown", { bold: true, color: "FFFFFF", fill: "1E293B", size: 19, align: AlignmentType.CENTER, widthDxa: 4000 }),
      createDocxCell("Total Pledged Amount", { bold: true, color: "FFFFFF", fill: "1E293B", size: 19, align: AlignmentType.RIGHT, widthDxa: 4300 }),
    ],
  })

  const summaryRows: TableRow[] = [summaryHeader]
  let summaryIdx = 0

  for (const [areaName, stat] of areaMap.entries()) {
    const fill = summaryIdx % 2 === 1 ? "F8FAFC" : "FFFFFF"
    summaryIdx += 1
    const breakdownText = stat.count > 0 ? `${stat.recurring} Recurring, ${stat.onetime} One-Time` : "0 Partners"
    summaryRows.push(
      new TableRow({
        children: [
          createDocxCell(areaName, { bold: true, color: "0F172A", size: 18, fill, widthDxa: 4500 }),
          createDocxCell(String(stat.count), { align: AlignmentType.CENTER, fill, widthDxa: 2500 }),
          createDocxCell(breakdownText, { align: AlignmentType.CENTER, fill, widthDxa: 4000 }),
          createDocxCell(stat.totalAmount > 0 ? formatCurrency(stat.totalAmount) : "-", {
            align: AlignmentType.RIGHT,
            bold: true,
            color: "0F172A",
            fill,
            widthDxa: 4300,
          }),
        ],
      }),
    )
  }

  // Summary Total Row
  summaryRows.push(
    new TableRow({
      children: [
        createDocxCell("Total Across All Areas", { bold: true, color: "0F172A", size: 18, fill: "E2E8F0", widthDxa: 4500 }),
        createDocxCell(String(grandTotalCount), { bold: true, align: AlignmentType.CENTER, fill: "E2E8F0", widthDxa: 2500 }),
        createDocxCell(`${rows.length} Total Registered`, { bold: true, align: AlignmentType.CENTER, fill: "E2E8F0", widthDxa: 4000 }),
        createDocxCell(grandTotalAmount > 0 ? formatCurrency(grandTotalAmount) : "-", {
          bold: true,
          align: AlignmentType.RIGHT,
          color: "0F172A",
          fill: "E2E8F0",
          widthDxa: 4300,
        }),
      ],
    }),
  )

  const summaryTable = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: tableBorders,
    rows: summaryRows,
  })

  // 2. Master Table of all partners
  const directoryHeaders = [
    { text: "#", widthDxa: 500, align: AlignmentType.CENTER },
    { text: "Date", widthDxa: 1200, align: AlignmentType.LEFT },
    { text: "Partner Name", widthDxa: 2100, align: AlignmentType.LEFT },
    { text: "Contact Info", widthDxa: 2300, align: AlignmentType.LEFT },
    { text: "Location", widthDxa: 1200, align: AlignmentType.LEFT },
    { text: "Type & Frequency", widthDxa: 1700, align: AlignmentType.LEFT },
    { text: "Area of Partnership", widthDxa: 2100, align: AlignmentType.LEFT },
    { text: "Amount", widthDxa: 1300, align: AlignmentType.RIGHT },
    { text: "Payment", widthDxa: 1200, align: AlignmentType.LEFT },
    { text: "Prayer / Message", widthDxa: 1700, align: AlignmentType.LEFT },
  ]

  const directoryHeaderRow = new TableRow({
    tableHeader: true,
    children: directoryHeaders.map((h) =>
      createDocxCell(h.text, {
        bold: true,
        color: "FFFFFF",
        fill: "1E293B",
        size: 18,
        align: h.align,
        widthDxa: h.widthDxa,
      }),
    ),
  })

  const directoryRows: TableRow[] = [directoryHeaderRow]

  rows.forEach((partner, index) => {
    const isOdd = index % 2 === 1
    const rowFill = isOdd ? "F8FAFC" : "FFFFFF"

    const contactParagraphs = [
      new Paragraph({
        spacing: { before: 10, after: 10 },
        children: [new TextRun({ text: partner.phone || "-", bold: true, size: 17, color: "1E293B", font: "Calibri" })],
      }),
      new Paragraph({
        spacing: { before: 10, after: 10 },
        children: [new TextRun({ text: partner.email || "-", size: 16, color: "475569", font: "Calibri" })],
      }),
    ]

    const typeText = partner.pledge_frequency
      ? `${partner.partnership_type} (${partner.pledge_frequency})`
      : partner.partnership_type

    const areaParagraphs = [
      new Paragraph({
        spacing: { before: 10, after: 10 },
        children: [
          new TextRun({
            text: partner.area_of_partnership || "Unspecified",
            bold: true,
            size: 18,
            color: "0F172A",
            font: "Calibri",
          }),
        ],
      }),
    ]

    directoryRows.push(
      new TableRow({
        children: [
          createDocxCell(String(index + 1), { fill: rowFill, align: AlignmentType.CENTER, widthDxa: 500 }),
          createDocxCell(formatDate(partner.created_at), { fill: rowFill, widthDxa: 1200 }),
          createDocxCell(
            [
              new Paragraph({
                spacing: { before: 10, after: 10 },
                children: [
                  new TextRun({ text: partner.full_name, bold: true, size: 18, color: "0F172A", font: "Calibri" }),
                  ...(partner.is_anonymous
                    ? [new TextRun({ text: " (Anon)", size: 15, italics: true, color: "94A3B8", font: "Calibri" })]
                    : []),
                ],
              }),
            ],
            { fill: rowFill, widthDxa: 2100 },
          ),
          createDocxCell(contactParagraphs, { fill: rowFill, widthDxa: 2300 }),
          createDocxCell(partner.location || "-", { fill: rowFill, widthDxa: 1200 }),
          createDocxCell(typeText, { fill: rowFill, widthDxa: 1700 }),
          createDocxCell(areaParagraphs, { fill: rowFill, widthDxa: 2100 }),
          createDocxCell(formatCurrency(partner.amount), {
            fill: rowFill,
            align: AlignmentType.RIGHT,
            bold: true,
            color: "0F172A",
            widthDxa: 1300,
          }),
          createDocxCell(partner.payment_method || "-", { fill: rowFill, widthDxa: 1200 }),
          createDocxCell(partner.message || "-", { fill: rowFill, size: 16, color: "475569", widthDxa: 1700 }),
        ],
      }),
    )
  })

  const directoryTable = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: tableBorders,
    rows: directoryRows,
  })

  const file = new Document({
    sections: [
      {
        properties: {
          page: {
            size: { orientation: PageOrientation.LANDSCAPE },
            margin: { top: 720, bottom: 720, left: 720, right: 720 },
          },
        },
        children: [
          new Paragraph({
            spacing: { before: 0, after: 60 },
            children: [
              new TextRun({
                text: "PSALMIST NATION TABERNACLE",
                bold: true,
                size: 32,
                color: "1E293B",
                font: "Calibri",
              }),
            ],
          }),
          new Paragraph({
            spacing: { before: 0, after: 80 },
            children: [
              new TextRun({
                text: "PARTNERSHIP DIRECTORY & REPORT",
                bold: true,
                size: 22,
                color: "B58914",
                font: "Calibri",
              }),
            ],
          }),
          new Paragraph({
            spacing: { before: 0, after: 240 },
            children: [
              new TextRun({
                text: `Generated: ${dateFormatted}  |  Total Records: ${rows.length}`,
                size: 18,
                color: "64748B",
                font: "Calibri",
              }),
            ],
          }),
          new Paragraph({
            spacing: { before: 100, after: 80 },
            children: [
              new TextRun({
                text: "Summary by Area of Partnership",
                bold: true,
                size: 22,
                color: "1E293B",
                font: "Calibri",
              }),
            ],
          }),
          summaryTable,
          new Paragraph({
            spacing: { before: 280, after: 80 },
            children: [
              new TextRun({
                text: "All Registered Partners",
                bold: true,
                size: 22,
                color: "1E293B",
                font: "Calibri",
              }),
            ],
          }),
          directoryTable,
        ],
      },
    ],
  })

  const blob = await Packer.toBlob(file)
  const name = `partners-${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}.docx`
  const url = URL.createObjectURL(blob)
  const link = window.document.createElement("a")
  link.href = url
  link.download = name
  link.click()
  URL.revokeObjectURL(url)
}

function downloadCsv(rows: PartnerRow[]) {
  const today = new Date()
  const name = `partners-${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}.csv`
  const lines = [
    [...columns, "Message"].join(","),
    ...rows.map((partner) => [...cells(partner), partner.message ?? ""].map(csvCell).join(",")),
  ]
  const file = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8" })
  const url = URL.createObjectURL(file)
  const link = document.createElement("a")
  link.href = url
  link.download = name
  link.click()
  URL.revokeObjectURL(url)
}

export function Admin() {
  const [ready, setReady] = useState(false)
  const [signedIn, setSignedIn] = useState(false)

  useEffect(() => {
    document.title = "Admin | Psalmist Nation Tabernacle"
  }, [])

  useEffect(() => {
    if (!supabase) {
      setReady(true)
      return
    }
    let active = true
    supabase.auth.getSession().then(({ data }) => {
      if (!active) return
      setSignedIn(Boolean(data.session))
      setReady(true)
    })
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      setSignedIn(Boolean(session))
      setReady(true)
    })
    return () => {
      active = false
      data.subscription.unsubscribe()
    }
  }, [])

  if (!ready) return null
  if (!supabase) {
    return (
      <section className="mx-auto max-w-md px-4 py-16">
        <p className="text-sm text-[#D4D4D4]">The database connection is not configured.</p>
      </section>
    )
  }
  if (!signedIn) return <Login />
  return <Dashboard />
}

function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!supabase) return
    setLoading(true)
    setError("")
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    })
    setLoading(false)
    if (signInError) {
      const invalid = /invalid login credentials/i.test(signInError.message)
      setError(invalid ? "Incorrect email or password" : "We could not log you in. Please try again.")
    }
  }

  return (
    <section className="flex min-h-[70dvh] items-center px-4 py-10">
      <form onSubmit={onSubmit} className="glass-panel mx-auto w-full max-w-md px-5 py-8" noValidate>
        <h1 className="font-display text-3xl font-extrabold leading-[1.15]">Log in</h1>
        <label className="mt-6 flex flex-col gap-2 text-sm font-medium" htmlFor="admin-email">
          Email
          <input
            id="admin-email"
            type="email"
            autoComplete="username"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="glass-input"
          />
        </label>
        <label className="mt-4 flex flex-col gap-2 text-sm font-medium" htmlFor="admin-password">
          Password
          <input
            id="admin-password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="glass-input"
          />
        </label>
        {error ? (
          <p className="mt-4 text-sm text-[#F0B4B4]" role="alert">
            {error}
          </p>
        ) : null}
        <div className="mt-6">
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Logging in..." : "Log in"}
          </Button>
        </div>
      </form>
    </section>
  )
}

function Dashboard() {
  const [partners, setPartners] = useState<PartnerRow[]>([])
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading")
  const [query, setQuery] = useState("")
  const [type, setType] = useState("All")
  const [area, setArea] = useState("All")
  const [openId, setOpenId] = useState<string | null>(null)

  useEffect(() => {
    if (!supabase) return
    let active = true
    supabase
      .from("partners")
      .select(
        "id, created_at, full_name, email, phone, location, partnership_type, pledge_frequency, area_of_partnership, amount, payment_method, is_anonymous, message",
      )
      .order("created_at", { ascending: false })
      .then(({ data, error }) => {
        if (!active) return
        if (error) {
          setStatus("error")
          return
        }
        setPartners((data ?? []) as PartnerRow[])
        setStatus("ready")
      })
    return () => {
      active = false
    }
  }, [])

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase()
    return partners.filter((partner) => {
      const matchesQuery =
        needle === "" ||
        partner.full_name.toLowerCase().includes(needle) ||
        partner.email.toLowerCase().includes(needle) ||
        partner.phone.toLowerCase().includes(needle)
      const matchesType = type === "All" || partner.partnership_type === type
      const matchesArea = area === "All" || partner.area_of_partnership === area
      return matchesQuery && matchesType && matchesArea
    })
  }, [partners, query, type, area])

  async function logOut() {
    if (!supabase) return
    await supabase.auth.signOut()
  }

  return (
    <section className="mx-auto w-full min-w-0 max-w-7xl px-4 py-8 md:px-8">
      <div className="flex items-start justify-between gap-4">
        <h1 className="font-display text-3xl font-extrabold leading-[1.15] sm:text-4xl">Partners</h1>
        <Button type="button" variant="secondary" onClick={logOut}>
          Log out
        </Button>
      </div>

      {status === "loading" ? <p className="mt-8 text-sm text-[#D4D4D4]">Loading partners...</p> : null}
      {status === "error" ? (
        <p className="mt-8 text-sm text-[#F0B4B4]" role="alert">
          Partners could not be loaded. Please try again.
        </p>
      ) : null}
      {status === "ready" && partners.length === 0 ? (
        <p className="mt-8 text-base text-[#D4D4D4]">No partners yet</p>
      ) : null}

      {status === "ready" && partners.length > 0 ? (
        <>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <p className="font-display text-2xl font-extrabold">{filtered.length} partners</p>
            <div className="flex flex-wrap gap-3">
              <Button type="button" variant="secondary" onClick={() => downloadCsv(filtered)}>
                Download CSV
              </Button>
              <Button type="button" variant="secondary" onClick={() => void downloadDocx(filtered)}>
                <svg viewBox="0 0 24 24" aria-hidden="true" className="mr-2 h-4 w-4 fill-none stroke-current">
                  <path d="M12 3v12" strokeWidth="1.5" />
                  <path d="M7 11l5 5 5-5" strokeWidth="1.5" />
                  <path d="M5 21h14" strokeWidth="1.5" />
                </svg>
                DOCX
              </Button>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-3">
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search name, email, or phone"
              aria-label="Search name, email, or phone"
              className="glass-input"
            />
            <select value={type} onChange={(event) => setType(event.target.value)} aria-label="Partnership Type" className="glass-input">
              <option value="All">All Partnership Types</option>
              {PARTNERSHIP_TYPES.map((item) => (
                <option key={item.value} value={item.value}>{item.value}</option>
              ))}
            </select>
            <select value={area} onChange={(event) => setArea(event.target.value)} aria-label="Area of Partnership" className="glass-input">
              <option value="All">All Areas of Partnership</option>
              {AREAS_OF_PARTNERSHIP.map((item) => (
                <option key={item} value={item}>{item}</option>
              ))}
            </select>
          </div>
          {filtered.length === 0 ? (
            <p className="mt-8 text-sm text-[#D4D4D4]">No partners match these filters.</p>
          ) : (
            <>
              <div className="mt-6 hidden md:block">
                <table className="w-full border-separate border-spacing-y-3 text-left text-sm">
                  <thead>
                    <tr className="text-[#D4D4D4]">
                      {columns.map((column) => (
                        <th key={column} className="px-3 py-2 font-medium">
                          {column}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((partner) => {
                      const open = openId === partner.id
                      return (
                        <Fragment key={partner.id}>
                          <tr
                            className="cursor-pointer bg-white/5"
                            onClick={() => setOpenId(open ? null : partner.id)}
                          >
                            {cells(partner).map((value, index) => (
                              <td key={columns[index]} className="break-words px-3 py-3 align-top">
                                {value}
                              </td>
                            ))}
                          </tr>
                          {open ? (
                            <tr>
                              <td colSpan={columns.length} className="px-3 pb-3 text-sm text-[#D4D4D4]">
                                <p className="font-medium text-[#F4F4F5]">Message / Prayer Request</p>
                                <p className="mt-2 whitespace-pre-wrap">{partner.message || "No message."}</p>
                              </td>
                            </tr>
                          ) : null}
                        </Fragment>
                      )
                    })}
                  </tbody>
                </table>
              </div>
              <div className="mt-6 grid gap-4 md:hidden">
                {filtered.map((partner) => {
                  const open = openId === partner.id
                  const values = cells(partner)
                  return (
                    <article key={partner.id} className="glass-panel p-4">
                      <button type="button" className="w-full text-left" onClick={() => setOpenId(open ? null : partner.id)}>
                        {columns.map((column, index) => (
                          <p key={column} className="mt-2 first:mt-0">
                            <span className="text-[#D4D4D4]">{column}: </span>
                            <span className="break-words">{values[index]}</span>
                          </p>
                        ))}
                      </button>
                      {open ? (
                        <div className="mt-4 border-t border-white/10 pt-4 text-sm text-[#D4D4D4]">
                          <p className="font-medium text-[#F4F4F5]">Message / Prayer Request</p>
                          <p className="mt-2 whitespace-pre-wrap">{partner.message || "No message."}</p>
                        </div>
                      ) : null}
                    </article>
                  )
                })}
              </div>
            </>
          )}
        </>
      ) : null}
    </section>
  )
}
