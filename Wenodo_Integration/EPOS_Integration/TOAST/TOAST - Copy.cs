using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Renci.SshNet;
using System.Data;
using Utility;
using App_Repository;
using EPOS_Integration.EPOS_SALES;
using EPOS_Integration.Common;
using ViewModels;
using CsvHelper.Configuration;
using CsvHelper;

namespace EPOS_Integration.TOAST
{
    public class TOAST
    {
        //string host = "s-9b0f88558b264dfda.server.transfer.us-east-1.amazonaws.com";
        //string username = "NACMayfairRDataExportUser";
        string privateKeyPath = @"\\EC2AMAZ-BC9VRA8\ProdUploads\Toast\SSH FILE\.ssh\toast_key_openssh";
        string remoteBaseDirectory = "/239587/";
        string localDirectory = @"\\EC2AMAZ-BC9VRA8\ProdUploads\Toast\TOAST FILES\Process";
        string archiveDirectory = @"\\EC2AMAZ-BC9VRA8\ProdUploads\Toast\TOAST FILES\Archive";
        string errorDirectory = @"\\EC2AMAZ-BC9VRA8\ProdUploads\Toast\TOAST FILES\Error";


        public void GetToastSalesData(DataTable CashupDetail, DataTable CashupIntegratonDetail)
        {
            Cashup _obj = new Cashup();
            foreach (DataRow dr in CashupDetail.Rows)
            {
                _obj.CashupModelObj = new CashupModel();
                _obj.CashupModelObj.CASHUP_MAIN_ID = Convert.ToDecimal(dr["ID"]);
                _obj.CashupModelObj.BRANCH_ID = Convert.ToDecimal(dr["BRANCH_ID"]);
                _obj.CashupModelObj.USER_ID = 1;
                //DataTable dt_Session = Obj.GET_SESSION_BY_BRANCH();
                DataTable dt_Session = Common_Methods.GetSessions(Convert.ToDecimal(dr["ID"]), Convert.ToDecimal(dr["BRANCH_ID"]));
                DataView dv = CashupIntegratonDetail.DefaultView;
                dv.RowFilter = "BRANCH_ID=" + Convert.ToDecimal(dr["BRANCH_ID"]);
                DataTable dtIntegrationData = dv.ToTable();
                
                foreach (DataRow dr_session in dt_Session.Select("SESSION_MASTER_ID=4").CopyToDataTable().Rows)
                {
                    //string Cashup_date = Convert.ToDateTime(dr["CASHUP_DATE"]).ToString("yyyy-MM-dd");
                    DateTime _dtSalesDate = Convert.ToDateTime(dr["CASHUP_DATE"]);
                    String _sSiteName = "NAC";
                    string processDateFolder = _dtSalesDate.ToString("ddMMyyyy") + "_" + _sSiteName;
                    string _sProcessDirectoryPath = localDirectory + "\\" + processDateFolder + "\\";
                    string _sArchiveDirectoryPath = archiveDirectory + "\\" + processDateFolder;
                    string _sErrorDirectoryPath = errorDirectory + "\\" + processDateFolder;
                    Directory.CreateDirectory(localDirectory);
                    string[] filesList = { "OrderDetails.csv", "ItemSelectionDetails.csv", "PaymentDetails.csv", "ModifiersSelectionDetails.csv", "CheckDetails.csv" };
                    try
                    {
                        int _iresult = GetFiles(_sSiteName, _dtSalesDate, _sProcessDirectoryPath, dtIntegrationData.Rows[0]["URL_PARAMETERS"].ToString(), dtIntegrationData.Rows[0]["API_KEY"].ToString());
                        if (_iresult == 2)
                        {

                            DataSet _dsFilesData = ReadFilesintoDataset(filesList, _sProcessDirectoryPath);
                            if (_dsFilesData != null)
                            {
                                //Save Data To DB
                                SaveDataToDB(CashupIntegratonDetail, _dsFilesData, _obj.CashupModelObj.CASHUP_MAIN_ID, _obj);
                                MoveFiles(filesList, _sProcessDirectoryPath, _sArchiveDirectoryPath);
                                //Move to Archive
                            }
                            else
                            {
                                _obj.CashupModelObj.INTEGRATION_STATUS = 4; //Co
                                _obj.UPD_CASHUP_MAIN_FOR_INTEGRATION();   
                                //Update integration status with error
                                //MoveFiles(filesList, _sProcessDirectoryPath, _sArchiveDirectoryPath); 
                            }

                        }
                        else
                        {
                            _obj.CashupModelObj.INTEGRATION_STATUS = _iresult; //Co
                            _obj.UPD_CASHUP_MAIN_FOR_INTEGRATION();
                            //MoveFiles(filesList, _sProcessDirectoryPath, _sArchiveDirectoryPath);

                        }
                    }
                    catch (Exception ex)
                    {
                        _obj.CashupModelObj.INTEGRATION_STATUS = 3; //Co
                        _obj.UPD_CASHUP_MAIN_FOR_INTEGRATION();
                        //MoveFiles(filesList, _sProcessDirectoryPath, _sArchiveDirectoryPath);
                    }

                }
            }
        }

        public DataTable ConvertCsvToDataTable(string filePath, string listDelimiter)
        {

            string[] rows = File.ReadAllLines(filePath);

            if (rows.Length == 0)
            {
                throw new Exception("CSV file is empty.");
            }
            string[] _columns = rows[0].Split(','); // First row is the header
            DataTable dataTable = new DataTable();

            // Initialize DataTable and add columns
            foreach (string column in _columns)
            {
                if (column.Trim().ToLower() == "Order Id".ToLower())
                    dataTable.Columns.Add("Order_Id", typeof(string));
                else if (column.Trim().ToLower() == "Discount Amount".ToLower())
                    dataTable.Columns.Add("Discount_Amount", typeof(string));
                else if (column.Trim().ToLower() == "Gross Price".ToLower())
                    dataTable.Columns.Add("Gross_Price", typeof(string));
                else if (column.Trim().ToLower() == "Void Reason ID".ToLower())
                    dataTable.Columns.Add("Void_Reason_ID", typeof(string));
                else if (column.Trim().ToLower() == "Void Reason".ToLower())
                    dataTable.Columns.Add("Void_Reason", typeof(string));
                else if (column.Trim().ToLower() == "Order Date".ToLower())
                    dataTable.Columns.Add("Order_Date", typeof(string));
                else if (column.Trim().ToLower() == "Refund Amount".ToLower())
                    dataTable.Columns.Add("Refund_Amount", typeof(string));
                else if (column.Trim().ToLower() == "Order #".ToLower())
                    dataTable.Columns.Add("Order_#", typeof(string));
                else if (column.Trim().ToLower() == "Check #".ToLower())
                    dataTable.Columns.Add("Check_#", typeof(string));
                else if (column.Trim().ToLower() == "Check Id".ToLower())
                    dataTable.Columns.Add("Check_Id", typeof(string));
                else if (column.Trim().ToLower() == "Paid Date".ToLower())
                    dataTable.Columns.Add("Paid_Date", typeof(string));
                else
                    dataTable.Columns.Add(column.Trim(), typeof(string));
            }

            //Add rows from the remaining lines
            if (Path.GetFileName(filePath).ToLower() == "OrderDetails.csv".ToLower())
            {
                for (int row = 1; row < rows.Length; row++)
                {
                    string[] rowValues = rows[row].Split(listDelimiter[0]);
                    // Validate the row has the same number of columns as the header
                    DataRow newRow = dataTable.NewRow();
                    if (rowValues.Length != _columns.Length)
                    {
                        bool flag = false;
                        int _iRowDiff = rowValues.Length - _columns.Length;
                        for (int col = 0; col < _columns.Length; col++)
                        {
                            if (_iRowDiff > 0 && col == 3)
                            {
                                string _sValues = string.Empty;
                                for (int _iDiffCounter = 0; _iDiffCounter <= _iRowDiff; _iDiffCounter++)
                                {
                                    _sValues += rowValues[col + _iDiffCounter] + ",";
                                }
                                newRow[col] = _sValues;
                                flag = true;
                            }
                            else if (flag == true)
                            {
                                newRow[col] = Convert.ToString(rowValues[col + _iRowDiff]);
                            }
                            else
                            {
                                newRow[col] = Convert.ToString(rowValues[col]);
                            }



                            //if (col == 4)
                            //{
                            //    newRow[col - 1] = Convert.ToString(rowValues[col - 1] + "," + rowValues[col]);
                            //    flag = true;
                            //    // Assign values   
                            //}
                            //if (!flag)
                            //{
                            //    if (col != 3)
                            //    {
                            //        newRow[col] = Convert.ToString(rowValues[col]);
                            //    }
                            //}
                            //else
                            //{
                            //    if (col != 4)
                            //    {
                            //        newRow[col - 1] = Convert.ToString(rowValues[col]);
                            //    }

                            //}
                        }
                    }
                    else
                    {
                        for (int col = 0; col < _columns.Length; col++)
                        {
                            newRow[col] = Convert.ToString(rowValues[col]); // Assign values
                        }
                    }
                    dataTable.Rows.Add(newRow); // Add the row to the DataTable
                }
            }
            //else if (Path.GetFileName(filePath).ToLower() == "CheckDetails.csv".ToLower())
            //{
            //    for (int row = 1; row < rows.Length; row++)
            //    {
            //        string[] rowValues = rows[row].Split(listDelimiter[0]);
            //        DataRow newRow = dataTable.NewRow();
            //        if (rowValues.Length != _columns.Length)
            //        {
            //            bool flag = false;
            //            int _iRowDiff = rowValues.Length - _columns.Length;
            //            for (int col = 0; col < _columns.Length; col++)
            //            {
            //                if(rowValues[col] == "700000000551825683")
            //                {
            //                    string str = "";
            //                }
            //                if (_iRowDiff > 0 && col == 7)
            //                {
            //                    string _sValues = string.Empty;
            //                    for (int _iDiffCounter = 0; _iDiffCounter < _iRowDiff; _iDiffCounter++)
            //                    {
            //                        _sValues += rowValues[col + _iDiffCounter] + ",";
            //                    }
            //                    newRow[col] = _sValues;
            //                    flag = true;
            //                }
            //                else if (flag == true)
            //                {
            //                    newRow[col] = Convert.ToString(rowValues[col + _iRowDiff]);
            //                }
            //                else
            //                {
            //                    newRow[col] = Convert.ToString(rowValues[col]);
            //                }
            //            }
            //        }
            //        else
            //        {
            //            for (int col = 0; col < _columns.Length; col++)
            //            {
            //                newRow[col] = Convert.ToString(rowValues[col]); // Assign values
            //            }
            //        }
            //        dataTable.Rows.Add(newRow); // Add the row to the DataTable
            //    }
            //}
            else
            {

                for (int row = 1; row < rows.Length; row++)
                {
                    string[] rowValues = rows[row].Split(listDelimiter[0]);
                    DataRow newRow = dataTable.NewRow();
                    for (int col = 0; col < _columns.Length; col++)
                    {
                        newRow[col] = Convert.ToString(rowValues[col]);
                    }
                    dataTable.Rows.Add(newRow);
                }
            }

            Console.WriteLine($"DataTable created with {dataTable.Rows.Count} rows and {dataTable.Columns.Count} columns.");
            return dataTable;
        }

        int GetFiles(string sSiteName, DateTime dtSalesDate, string sProcessDirectoryPath, string host, string username)
        {
            // 3 Error // 4 File Not Found

            PrivateKeyFile privateKey = new PrivateKeyFile(privateKeyPath);
            ConnectionInfo connectionInfo = new ConnectionInfo(host, username, new PrivateKeyAuthenticationMethod(username, privateKey));

            using (var sftpClient = new SftpClient(connectionInfo))
            {
                try
                {
                    sftpClient.Connect();
                    // siteName = sSiteName; // Client Name
                    //string yesterdayDate = DateTime.Now.AddDays(-1).ToString("yyyyMMdd");
                    string _sRemoteDirectory = remoteBaseDirectory + dtSalesDate.ToString("yyyyMMdd") + "/";

                    if (!sftpClient.Exists(_sRemoteDirectory))
                    {
                        return 4;
                    }
                    Directory.CreateDirectory(sProcessDirectoryPath);
                    var files = sftpClient.ListDirectory(_sRemoteDirectory);
                    foreach (var file in files)
                    {
                        using (FileStream fs = new FileStream(sProcessDirectoryPath + file.Name, FileMode.Create))
                        {
                            sftpClient.DownloadFile(file.FullName, fs);
                        }
                    }
                }
                catch
                {
                    throw;
                }
                finally
                {
                    if (sftpClient.IsConnected)
                    {
                        sftpClient.Disconnect();
                    }

                }
                return 2;

            }

        }
        DataSet ReadFilesintoDataset(string[] filesList, string sProcessDirectoryPath)
        {
            DataSet ds_Toast_Sales = new DataSet();

            foreach (string file in filesList)
            {
                string filePath = Path.Combine(sProcessDirectoryPath, file);
                if (File.Exists(filePath))
                {
                    DataTable dataTable = LoadCsvData(filePath);
                    if (dataTable.Rows.Count == 0)
                    {
                        return null;
                    }
                    else
                    {
                        ds_Toast_Sales.Tables.Add(dataTable);
                    }
                }
                else
                {
                    return null;
                }
            }

            return ds_Toast_Sales;
        }
        void SaveDataToDB(DataTable CashupIntegratonDetail, DataSet _dsFilesData, decimal CASHUP_MAIN_ID, Cashup _obj)
        {
            TransformData<DataSet> transformData = new TransformData<DataSet>();
            transformData.DataTransform(IntegrationSource.TOAST, CashupIntegratonDetail, _dsFilesData, _obj.CashupModelObj.CASHUP_MAIN_ID, _obj);
            _obj.CashupModelObj.INTEGRATION_STATUS = 2; //Convert.ToInt32(Obj.CashupModelObj.INTEGRATION_STATUS);
            _obj.UPD_CASHUP_MAIN_FOR_INTEGRATION();
        }
        void MoveFiles(string[] filesList, string sourceDirectory, string destinationDirectory)
        {
            if (!Directory.Exists(destinationDirectory))
                Directory.CreateDirectory(destinationDirectory);

            if (Directory.Exists(destinationDirectory))
            {
                foreach (var file in new DirectoryInfo(sourceDirectory).GetFiles())
                {
                    if (File.Exists($@"{destinationDirectory}\{file.Name}"))
                    {
                        File.Delete($@"{destinationDirectory}\{file.Name}");
                    }
                    file.MoveTo($@"{destinationDirectory}\{file.Name}");
                }
            }


            //if (Directory.Exists(destinationDirectory))
            //{
            //    foreach (var file in new DirectoryInfo(sourceDirectory).GetFiles())
            //    {
            //        file.MoveTo($@"{destinationDirectory}\{file.Name}");
            //    }
            //}
        }
        private DataTable LoadCsvData(string refPath)
        {
            CsvConfiguration csvConfiguration = new CsvConfiguration(System.Globalization.CultureInfo.InvariantCulture)
            {
                Delimiter = ",",
                HasHeaderRecord = true,
            };
            var result = new DataTable();
            using (var sr = new StreamReader(refPath, Encoding.UTF8, false, 16384 * 2))
            {
                using (var rdr = new CsvReader(sr, csvConfiguration))
                using (var dataRdr = new CsvDataReader(rdr))
                {
                    result.Load(dataRdr);
                }
            }
            foreach (DataColumn col in result.Columns)
            {
                col.ColumnName = col.ColumnName.ToUpper().Replace(" ", "_").Replace("#", "NO");
            }
            return result;
        }
    }
}
