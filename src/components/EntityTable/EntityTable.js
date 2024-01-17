import { Card } from "@mui/material";
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import Table from "examples/Tables/Table";

export const EntityTable = ({ title, columns, tableRows }) => {
     return (
        <SoftBox mb={3}>
              <Card>
                <SoftBox display="flex" justifyContent="space-between" alignItems="center" p={3}>
                  <SoftTypography variant="h6">{ title }</SoftTypography>
                </SoftBox>
                <SoftBox
                  sx={{
                    "& .MuiTableRow-root:not(:last-child)": {
                      "& td": {
                        borderBottom: ({ borders: { borderWidth, borderColor } }) =>
                          `${borderWidth[1]} solid ${borderColor}`,
                      },
                    },
                  }}
                >
                  <Table columns={columns} rows={tableRows} />
                </SoftBox>
              </Card>
            </SoftBox>
     );
}

export default EntityTable;