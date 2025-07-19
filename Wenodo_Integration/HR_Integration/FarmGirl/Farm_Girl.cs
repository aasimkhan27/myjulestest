using Renci.SshNet;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Data;
using System.IO;
using Utility;
using System.Globalization;
namespace HR_Integration.FarmGirl
{
    public class Farm_Girl
    {
        DataTable FARMGIRL_ROTA_TYPE_FIELDS()
        {
            DataTable HARRI_ROTA_EMP_TYPE = new DataTable();
            DataColumn COLUMN_HEADER = new DataColumn("PAYROLL_ID", typeof(string)); HARRI_ROTA_EMP_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("EMPLOYEE_NAME", typeof(string)); HARRI_ROTA_EMP_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("PENSION_PRCT", typeof(int)); HARRI_ROTA_EMP_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("CATEGORY", typeof(string)); HARRI_ROTA_EMP_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("POSITION", typeof(string)); HARRI_ROTA_EMP_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("LOCATION", typeof(string)); HARRI_ROTA_EMP_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("BUSINESS_DATE", typeof(DateTime)); HARRI_ROTA_EMP_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("PAY_TYPE", typeof(string)); HARRI_ROTA_EMP_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("SCHEDULED_COST", typeof(decimal)); HARRI_ROTA_EMP_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("ACTUAL_COST", typeof(decimal)); HARRI_ROTA_EMP_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("SCHEDULED_CLOCK_IN", typeof(DateTime)); HARRI_ROTA_EMP_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("SCHEDULED_CLOCK_OUT", typeof(DateTime)); HARRI_ROTA_EMP_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("SCHEDULED_HOURS", typeof(decimal)); HARRI_ROTA_EMP_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("ACTUAL_CLOCK_IN", typeof(DateTime)); HARRI_ROTA_EMP_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("ACTUAL_CLOCK_OUT", typeof(DateTime)); HARRI_ROTA_EMP_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("ACTUAL_HOURS", typeof(decimal)); HARRI_ROTA_EMP_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("NI_CATEGORY", typeof(string)); HARRI_ROTA_EMP_TYPE.Columns.Add(COLUMN_HEADER);
            return HARRI_ROTA_EMP_TYPE;
        }
        public void SaveFirmGirlDataToDB(DataTable dt_IntegrationDetails)
        {
            string[] stringSeparators = new string[] { ":;:" };
            HR_Model HR_Model_Obj = new HR_Model();
            HR_Repository DB_Obj = new HR_Repository();
            string[] str = dt_IntegrationDetails.Rows[0]["URL_PATH"].ToString().Split(stringSeparators, StringSplitOptions.RemoveEmptyEntries);
            int port = Convert.ToInt16(str[1]);
            string host = str[0];
            string username = dt_IntegrationDetails.Rows[0]["USERID"].ToString();
            string password = dt_IntegrationDetails.Rows[0]["PASSWORD"].ToString();
            string remoteDirectory = str[2];
            string remoteDirectoryArchive = "/prod-dwh-farm-girl/ARCHIVE/";
            string remoteDirectoryError = "/prod-dwh-farm-girl/Error/";
            string localDirectory = @"D:\Uploads\HARRI\";

            DataTable DtFilePath = new DataTable();
            DtFilePath.Columns.Add("PATH");
            DtFilePath.Columns.Add("FILE_NAME");
            DtFilePath.Columns.Add("DATE_NUMBER");
            LogExceptions.LogInfo("Connect Loop Start - Harri - ");
            foreach (DataRow CashUpdr in dt_IntegrationDetails.Rows)
            {
                DtFilePath.Rows.Clear();
                //// Set up session options
                //SessionOptions sessionOptions = new SessionOptions
                //{
                //    Protocol = Protocol.Sftp,
                //    HostName = "sftp.harri.com",
                //    UserName = "dwh-farm-girl",
                //    Password = "jlJxgZLQ92gvP1!2",
                //    SshHostKeyFingerprint = "ssh-rsa 2048 hhmjmhd/MsV7lAr3cLI05+y4SyeShV6efakaGFXanUU",
                //};
                //sessionOptions.AddRawSettings("FSProtocol", "2");
                //using (Session session = new Session())
                //{
                //    // Connect
                //    session.Open(sessionOptions);
                //    // Your code
                //}
                using (var sftp = new SftpClient(host, username, password))
                {
                    try
                    {
                        LogExceptions.LogInfo("Connect start files - Farm Girl - ");
                        sftp.Connect();
                        LogExceptions.LogInfo("Connect Open files - Farm Girl - ");
                        var files = sftp.ListDirectory(remoteDirectory);
                        DataTable HARRI_ROTA_EMP_DATATABLE = new DataTable();
                        System.Globalization.CultureInfo enGB = new System.Globalization.CultureInfo("en-GB");
                        foreach (var file in files)
                        {
                            var filename = $"{localDirectory}/{file.Name}";
                            string VAR_FILE_DATE = "";
                            string SERVER_FILE_NAME = "";
                            string ORIGNAL_FILE_NAME = "";
                            if (!file.Name.StartsWith("."))
                            {
                                if (!File.Exists(filename))
                                {
                                    HARRI_ROTA_EMP_DATATABLE = FARMGIRL_ROTA_TYPE_FIELDS();
                                    string[] fileNameSplitArray = file.Name.Split('_');
                                    string remoteFileName = file.Name;
                                    ORIGNAL_FILE_NAME = remoteFileName;
                                    if (remoteFileName != "ARCHIVE" && remoteFileName != "Error")
                                    {
                                        string[] FILE_DATE = fileNameSplitArray[2].Split('.');
                                        VAR_FILE_DATE = FILE_DATE[0];
                                        string LocalItemsDirectory2 = localDirectory + "\\" + VAR_FILE_DATE + "\\";
                                        SERVER_FILE_NAME = LocalItemsDirectory2 + remoteFileName;
                                        DataTable csvFilereader = new DataTable();
                                        LogExceptions.LogInfo("start files -" + remoteFileName);
                                        if (Directory.Exists(LocalItemsDirectory2) == false)
                                        {
                                            Directory.CreateDirectory(LocalItemsDirectory2);
                                        }
                                        using (Stream fileStream = File.Create(LocalItemsDirectory2 + remoteFileName))
                                        {
                                            sftp.DownloadFile(file.FullName, fileStream);
                                            DataRow dritem = DtFilePath.NewRow();
                                            dritem[0] = file.FullName;
                                            dritem[1] = file.Name;
                                            dritem[2] = VAR_FILE_DATE;
                                            DtFilePath.Rows.Add(dritem);
                                        }
                                        csvFilereader = ReadExcel(LocalItemsDirectory2 + remoteFileName);
                                        HARRI_ROTA_EMP_DATATABLE = HARRI_ROTA_DT(csvFilereader);
                                        LogExceptions.LogInfo("End files -Items fetch successfully");
                                    }
                                }
                            }
                            if (HARRI_ROTA_EMP_DATATABLE.Rows.Count > 0)
                            {
                                int FLAG = SubmitGroup(HARRI_ROTA_EMP_DATATABLE, CashUpdr, VAR_FILE_DATE, ORIGNAL_FILE_NAME, SERVER_FILE_NAME);
                                if (FLAG == 2 || FLAG == 0)
                                {
                                    //prod-dwh-farm-girl
                                    string PathToUpload = remoteDirectoryArchive;
                                    if (FLAG == 0)
                                    {
                                        PathToUpload = remoteDirectoryError;
                                    }
                                    for (int i = 0; i < DtFilePath.Rows.Count; i++)
                                    {
                                        string sourcefile = localDirectory + "\\" + DtFilePath.Rows[i]["DATE_NUMBER"].ToString() + "\\" + DtFilePath.Rows[i]["FILE_NAME"].ToString();
                                        if (sftp.Exists(PathToUpload + DtFilePath.Rows[i]["DATE_NUMBER"]) == false)
                                        {
                                            sftp.CreateDirectory(PathToUpload + DtFilePath.Rows[i]["DATE_NUMBER"]);
                                        }
                                        sftp.ChangeDirectory(PathToUpload + DtFilePath.Rows[i]["DATE_NUMBER"]);
                                        using (FileStream fs = new FileStream(sourcefile, FileMode.Open))
                                        {
                                            sftp.BufferSize = 4 * 1024;
                                            sftp.UploadFile(fs, Path.GetFileName(sourcefile));
                                        }
                                        sftp.Delete(DtFilePath.Rows[i]["PATH"].ToString());
                                        LogExceptions.LogInfo("Delete File in pending" + DtFilePath.Rows[i]["PATH"].ToString());
                                    }
                                    //HR_Model_Obj.INTEGRATION_STATUS = 2;
                                    //HR_Model_Obj.ERROR_MESSAGE = "";
                                    //DB_Obj.HR_Modelobj = HR_Model_Obj;
                                    //DB_Obj.UPD_CASHUP_MAIN_FOR_INTEGRATION();
                                    DtFilePath.Rows.Clear();
                                    HARRI_ROTA_EMP_DATATABLE.Rows.Clear();
                                }
                            }
                            else
                            {
                                // HR_Model_Obj.INTEGRATION_STATUS = 4;
                                //HR_Model_Obj.ERROR_MESSAGE = "";
                                //DB_Obj.HR_Modelobj = HR_Model_Obj;
                                //DB_Obj.UPD_CASHUP_MAIN_FOR_INTEGRATION();
                            }
                        }
                    }
                    catch (Exception ex)
                    {
                        LogExceptions.LogError("FetchAllFile - Farm Girl - ", ex);
                        //HR_Model_Obj.INTEGRATION_STATUS = 3;
                        //HR_Model_Obj.ERROR_MESSAGE = ex.ToString();
                        //DB_Obj.HR_Modelobj = HR_Model_Obj;
                        //DB_Obj.UPD_CASHUP_MAIN_FOR_INTEGRATION();
                        if (ex.Message == "An existing connection was forcibly closed by the remote host")
                        {
                            LogExceptions.LogInfo("run error code");
                            //HR_Model_Obj.INTEGRATION_STATUS = 0;
                            //HR_Model_Obj.ERROR_MESSAGE = ex.ToString();
                            //DB_Obj.HR_Modelobj = HR_Model_Obj;
                            //DB_Obj.UPD_CASHUP_MAIN_FOR_INTEGRATION();
                        }
                    }
                    LogExceptions.LogInfo("Connect Close start files - Farm Girl - ");
                    sftp.Disconnect();
                    sftp.Dispose();
                    LogExceptions.LogInfo("Connect Close files - Farm Girl - ");
                }
            }
        }
        public DataTable HARRI_ROTA_DT(DataTable dt)
        {
            DataTable DT = FARMGIRL_ROTA_TYPE_FIELDS();
            for (int i = 0; i < dt.Rows.Count; i++)
            {
                DataRow DR_HEADER = DT.NewRow();
                DR_HEADER["PAYROLL_ID"] = dt.Rows[i]["Payroll ID"];
                DR_HEADER["EMPLOYEE_NAME"] = dt.Rows[i]["Employee Name"];
                DR_HEADER["PENSION_PRCT"] = Convert.ToDecimal(dt.Rows[i]["Pension %"]);
                DR_HEADER["CATEGORY"] = dt.Rows[i]["Category"];
                DR_HEADER["POSITION"] = dt.Rows[i]["Position"];
                DR_HEADER["LOCATION"] = dt.Rows[i]["Location"];
                DR_HEADER["BUSINESS_DATE"] = Convert.ToDateTime(dt.Rows[i]["Business Date"]);
                DR_HEADER["PAY_TYPE"] = dt.Rows[i]["Pay Type"];
                DR_HEADER["SCHEDULED_COST"] = Convert.ToDecimal(dt.Rows[i]["Scheduled Cost"]);
                DR_HEADER["ACTUAL_COST"] = Convert.ToDecimal(dt.Rows[i]["Actual Cost"]);
                DR_HEADER["SCHEDULED_CLOCK_IN"] = dt.Rows[i]["Scheduled Clock In"].ToString() == "" || dt.Rows[i]["Scheduled Clock In"] == null ? (object)DBNull.Value : Convert.ToDateTime(dt.Rows[i]["Scheduled Clock In"]);
                DR_HEADER["SCHEDULED_CLOCK_OUT"] = dt.Rows[i]["Scheduled Clock Out"].ToString() == "" || dt.Rows[i]["Scheduled Clock Out"] == null ? (object)DBNull.Value : Convert.ToDateTime(dt.Rows[i]["Scheduled Clock Out"]);
                DR_HEADER["SCHEDULED_HOURS"] = Convert.ToDecimal(dt.Rows[i]["Scheduled Hours"]);
                DR_HEADER["ACTUAL_CLOCK_IN"] = dt.Rows[i]["Actual Clock In"].ToString() == "" || dt.Rows[i]["Actual Clock In"] == null ? (object)DBNull.Value : Convert.ToDateTime(dt.Rows[i]["Actual Clock In"]);
                DR_HEADER["ACTUAL_CLOCK_OUT"] = dt.Rows[i]["Actual Clock Out"].ToString() == "" || dt.Rows[i]["Actual Clock Out"] == null ? (object)DBNull.Value : Convert.ToDateTime(dt.Rows[i]["Actual Clock Out"]);
                DR_HEADER["ACTUAL_HOURS"] = Convert.ToDecimal(dt.Rows[i]["Actual Hours"]);
                DR_HEADER["NI_CATEGORY"] = dt.Rows[i]["NI Category"].ToString() == "" || dt.Rows[i]["NI Category"] == null ? (object)DBNull.Value : dt.Rows[i]["NI Category"];
                DT.Rows.Add(DR_HEADER);
            }
            return DT;
        }
        private DataTable ReadExcel(string path)
        {
            //WorkBook workbook = WorkBook.LoadCSV(path, fileFormat: ExcelFileFormat.XLSX, ListDelimiter: ";");
            //WorkSheet sheet = workbook.DefaultWorkSheet;
            DataTable dt = ConvertCsvToDataTable(path, ",");
            return dt;
        }
        public DataTable ConvertCsvToDataTable(string filePath, string ListDelimiter)
        {
            //reading all the lines(rows) from the file.
            string[] rows = File.ReadAllLines(filePath);
            DataTable dtData = new DataTable();
            DataRow dr = dtData.NewRow();
            //Creating columns
            if (rows.Length > 0)
            {
                foreach (string columnName in rows[0].Split(','))
                    dtData.Columns.Add(columnName);
            }
            //Creating row for each line.(except the first line, which contain column names)
            for (int row = 1; row < rows.Length; row++)
            {
                string[] rowValues = null;
                rowValues = rows[row].Split(',');
                int i = 0;
                while (i < rowValues.Length)
                {
                    rowValues[i] = rowValues[i].Replace("\"", string.Empty).Trim();
                    i++;
                }
                dr = dtData.NewRow();
                dr.ItemArray = rowValues;
                dtData.Rows.Add(dr);
            }
            return dtData;
        }
        int SubmitGroup(DataTable HARRI_ROTA_EMP_DATATABLE, DataRow dr, string FILE_DATE, string ORIGNAL_FILE_NAME, string SERVER_FILE_NAME)
        {
            HR_Model Obj = new HR_Model();
            try
            {
                HR_Repository HrDb = new HR_Repository();
                //Save Data in Database
                DateTime d;
                bool status = false;
                HR_Model _Obj = new HR_Model();
                _Obj.FILE_DATE = Convert.ToDateTime(DateTime.ParseExact(FILE_DATE, "dd-MM-yyyy", CultureInfo.InvariantCulture).ToString("yyyy-MM-dd"));
                _Obj.ORIGNAL_FILE_NAME = (ORIGNAL_FILE_NAME);
                _Obj.SERVER_FILE_NAME = (SERVER_FILE_NAME);
                _Obj.ENTITY_ID = Convert.ToInt32(dr["ENTITY_ID"]);
                if (dr["BRANCH_ID"] != DBNull.Value)
                {
                    _Obj.BRANCH_ID = Convert.ToInt32(dr["BRANCH_ID"]);
                };
                _Obj.HARRI_ROTA_EMP_TYPE = HARRI_ROTA_EMP_DATATABLE;
                HrDb.HR_Modelobj = _Obj;
                Int32 PO_FLAG = HrDb.INS_HARRI_EMP_ROTA();
                Int32 RETURN_FLAG = 2;
                if (PO_FLAG == 0)
                {
                    RETURN_FLAG = PO_FLAG;
                }

                return RETURN_FLAG;
            }
            catch (Exception ex)
            {
                LogExceptions.LogError(" Farm Girl Rota All:- Fail To Saving Data in DB - ", ex);
                //Obj.INTEGRATION_STATUS = 3;
                //Obj.ERROR_MESSAGE = ex.ToString();
                ////Obj.UPD_CASHUP_MAIN_FOR_INTEGRATION();
                return 3;
            }
        }
    }
}
