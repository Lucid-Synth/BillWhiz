import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Section,
  Text,
  Hr,
} from "@react-email/components";

interface Props {
  invoice: any;
}

const colors = {
  bg: "#fafafa",
  card: "#ffffff",
  border: "#eeeeee",
  text: "#1a1a1a",
  muted: "#8a8a8a",
  amber: "#b45309",
  amberSoft: "#fef3e2",
  danger: "#b91c1c",
  dangerSoft: "#fef2f2",
};

const severityColor = (severity: string) => {
  switch ((severity ?? "").toLowerCase()) {
    case "high":
      return colors.danger;
    case "medium":
      return colors.amber;
    default:
      return colors.muted;
  }
};

export default function InvoiceEmail({ invoice }: Props) {
  const summary = invoice.aiResponse?.invoice_summary;
  const anomalies = invoice.aiResponse?.anomalies ?? [];
  const lineItems = invoice.aiResponse?.line_items ?? [];

  return (
    <Html>
      <Head />

      <Body
        style={{
          backgroundColor: colors.bg,
          fontFamily:
            "-apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif",
          padding: "48px 0",
          margin: 0,
        }}
      >
        <Container
          style={{
            backgroundColor: colors.card,
            borderRadius: "12px",
            padding: "40px",
            maxWidth: "600px",
            border: `1px solid ${colors.border}`,
          }}
        >
          {/* Header */}
          <Text
            style={{
              fontSize: "12px",
              fontWeight: 600,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: colors.amber,
              margin: "0 0 8px 0",
            }}
          >
            Invoice Analysis
          </Text>

          <Heading
            style={{
              fontSize: "22px",
              fontWeight: 600,
              color: colors.text,
              margin: "0 0 6px 0",
            }}
          >
            {invoice.vendorName ?? summary?.vendor_name ?? "Invoice Report"}
          </Heading>

          <Text
            style={{
              fontSize: "14px",
              color: colors.muted,
              margin: "0 0 32px 0",
            }}
          >
            Your invoice has been analyzed successfully.
          </Text>

          {/* Summary */}
          <Section
            style={{
              backgroundColor: colors.bg,
              borderRadius: "10px",
              padding: "20px 24px",
              marginBottom: "32px",
            }}
          >
            <SummaryRow
              label="Invoice #"
              value={invoice.invoiceNumber ?? summary?.invoice_number ?? "-"}
            />
            <SummaryRow
              label="Total"
              value={`${invoice.currency ?? ""} ${invoice.total ?? "-"}`}
            />
            <SummaryRow label="Status" value={invoice.status ?? "-"} />
            <SummaryRow
              label="Anomalies"
              value={String(anomalies.length)}
              last
            />
          </Section>

          {/* Anomalies */}
          <SectionLabel>Anomalies</SectionLabel>

          {anomalies.length === 0 ? (
            <Text style={{ fontSize: "14px", color: colors.muted, margin: "0 0 32px 0" }}>
              No anomalies detected.
            </Text>
          ) : (
            <Section style={{ marginBottom: "32px" }}>
              {anomalies.map((a: any, index: number) => (
                <Section
                  key={index}
                  style={{
                    padding: "16px 0",
                    borderTop: index === 0 ? "none" : `1px solid ${colors.border}`,
                  }}
                >
                  <table width="100%" cellPadding={0} cellSpacing={0}>
                    <tr>
                      <td>
                        <Text
                          style={{
                            fontSize: "14px",
                            fontWeight: 600,
                            color: colors.text,
                            margin: 0,
                          }}
                        >
                          {a.type}
                        </Text>
                      </td>
                      <td align="right">
                        <Text
                          style={{
                            fontSize: "11px",
                            fontWeight: 600,
                            textTransform: "uppercase",
                            letterSpacing: "0.04em",
                            color: severityColor(a.severity),
                            margin: 0,
                          }}
                        >
                          {a.severity}
                        </Text>
                      </td>
                    </tr>
                  </table>

                  <Text
                    style={{
                      fontSize: "13px",
                      color: colors.muted,
                      margin: "6px 0 4px 0",
                    }}
                  >
                    {a.description}
                  </Text>

                  <Text
                    style={{
                      fontSize: "12px",
                      color: colors.muted,
                      margin: 0,
                    }}
                  >
                    Confidence {Math.round((a.confidence ?? 0) * 100)}%
                  </Text>
                </Section>
              ))}
            </Section>
          )}

          {/* Line Items */}
          <SectionLabel>Line Items</SectionLabel>

          {lineItems.length === 0 ? (
            <Text style={{ fontSize: "14px", color: colors.muted, margin: 0 }}>
              No line items found.
            </Text>
          ) : (
            <Section>
              {lineItems.map((item: any, index: number) => (
                <table
                  key={index}
                  width="100%"
                  cellPadding={0}
                  cellSpacing={0}
                  style={{
                    padding: "12px 0",
                    borderTop: index === 0 ? "none" : `1px solid ${colors.border}`,
                  }}
                >
                  <tr>
                    <td>
                      <Text style={{ fontSize: "14px", color: colors.text, margin: 0 }}>
                        {item.item}
                      </Text>
                      <Text style={{ fontSize: "12px", color: colors.muted, margin: "2px 0 0 0" }}>
                        Qty {item.quantity} · {item.unit_price} each
                      </Text>
                    </td>
                    <td align="right" style={{ verticalAlign: "top" }}>
                      <Text style={{ fontSize: "14px", fontWeight: 600, color: colors.text, margin: 0 }}>
                        {item.total_price}
                      </Text>
                    </td>
                  </tr>
                </table>
              ))}
            </Section>
          )}

          <Hr style={{ borderColor: colors.border, margin: "36px 0 20px 0" }} />

          <Text
            style={{
              color: colors.muted,
              fontSize: "12px",
              margin: 0,
            }}
          >
            This email was generated automatically by your Invoice AI system.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <Text
      style={{
        fontSize: "12px",
        fontWeight: 600,
        letterSpacing: "0.06em",
        textTransform: "uppercase",
        color: colors.muted,
        margin: "0 0 12px 0",
      }}
    >
      {children}
    </Text>
  );
}

function SummaryRow({
  label,
  value,
  last,
}: {
  label: string;
  value: string;
  last?: boolean;
}) {
  return (
    <table
      width="100%"
      cellPadding={0}
      cellSpacing={0}
      style={{ marginBottom: last ? 0 : "10px" }}
    >
      <tr>
        <td>
          <Text style={{ fontSize: "13px", color: colors.muted, margin: 0 }}>
            {label}
          </Text>
        </td>
        <td align="right">
          <Text style={{ fontSize: "13px", fontWeight: 600, color: colors.text, margin: 0 }}>
            {value}
          </Text>
        </td>
      </tr>
    </table>
  );
}