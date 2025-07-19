using Renci.SshNet;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.IO;
using System.Data;

using Utility;
using ViewModels;
using App_Repository;
using EPOS_Integration.Common;
using System.Globalization;
//using EPOS_Integration.EPOS_SALES;

namespace EPOS_Integration.LIOLONDON
{
    public class LioLondon
    {
        public class SearchParameters
        {
            public string FirstName { get; set; }
            public string LastName { get; set; }
            public string Email { get; set; }
        }

        DataTable ICG_SALES_HEADER_TYPE_FIELDS()
        {
            DataTable ICG_SALES_HEADER_TYPE = new DataTable();
            DataColumn COLUMN_HEADER = new DataColumn("ID_VENUE", typeof(int)); ICG_SALES_HEADER_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("VENUE", typeof(string)); ICG_SALES_HEADER_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("DATE", typeof(DateTime)); ICG_SALES_HEADER_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("FRONT", typeof(int)); ICG_SALES_HEADER_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("POS", typeof(string)); ICG_SALES_HEADER_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("Z", typeof(int)); ICG_SALES_HEADER_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("ID_ROOM", typeof(int)); ICG_SALES_HEADER_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("ROOM", typeof(string)); ICG_SALES_HEADER_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("SERIES", typeof(string)); ICG_SALES_HEADER_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("NUMBER", typeof(int)); ICG_SALES_HEADER_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("TIME_START", typeof(string)); ICG_SALES_HEADER_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("TIME_END", typeof(string)); ICG_SALES_HEADER_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("PAX", typeof(decimal)); ICG_SALES_HEADER_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("GROSS", typeof(decimal)); ICG_SALES_HEADER_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("TAXES", typeof(decimal)); ICG_SALES_HEADER_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("DISC_TOTAL", typeof(decimal)); ICG_SALES_HEADER_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("DISC_TOTAL_AMOUNT", typeof(decimal)); ICG_SALES_HEADER_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("TOTAL", typeof(decimal)); ICG_SALES_HEADER_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("ID_DISC_TOTAL_REASON", typeof(int)); ICG_SALES_HEADER_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("DISC_TOTAL_REASON", typeof(string)); ICG_SALES_HEADER_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("ID_SELLER", typeof(int)); ICG_SALES_HEADER_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("SELLER", typeof(string)); ICG_SALES_HEADER_TYPE.Columns.Add(COLUMN_HEADER);
            return ICG_SALES_HEADER_TYPE;
        }
        DataTable ICG_SALES_HEADER_TAXES_LIST()
        {
            DataTable ICG_SALES_HEADER_TAXES_TYPE = new DataTable();
            DataColumn COLUMN_HEADER = new DataColumn("ID_VENUE", typeof(int)); ICG_SALES_HEADER_TAXES_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("VENUE", typeof(string)); ICG_SALES_HEADER_TAXES_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("DATE", typeof(DateTime)); ICG_SALES_HEADER_TAXES_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("FRONT", typeof(int)); ICG_SALES_HEADER_TAXES_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("POS", typeof(string)); ICG_SALES_HEADER_TAXES_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("Z", typeof(int)); ICG_SALES_HEADER_TAXES_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("ID_ROOM", typeof(int)); ICG_SALES_HEADER_TAXES_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("ROOM", typeof(string)); ICG_SALES_HEADER_TAXES_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("SERIES", typeof(string)); ICG_SALES_HEADER_TAXES_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("NUMBER", typeof(int)); ICG_SALES_HEADER_TAXES_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("TIME_START", typeof(string)); ICG_SALES_HEADER_TAXES_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("TIME_END", typeof(string)); ICG_SALES_HEADER_TAXES_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("PAX", typeof(decimal)); ICG_SALES_HEADER_TAXES_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("NET", typeof(decimal)); ICG_SALES_HEADER_TAXES_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("TAX", typeof(decimal)); ICG_SALES_HEADER_TAXES_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("TAX_AMOUNT", typeof(decimal)); ICG_SALES_HEADER_TAXES_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("TOTAL", typeof(decimal)); ICG_SALES_HEADER_TAXES_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("ID_DISC_TOTAL_REASON", typeof(int)); ICG_SALES_HEADER_TAXES_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("DISC_TOTAL_REASON", typeof(string)); ICG_SALES_HEADER_TAXES_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("ID_SELLER", typeof(int)); ICG_SALES_HEADER_TAXES_TYPE.Columns.Add(COLUMN_HEADER);
            return ICG_SALES_HEADER_TAXES_TYPE;
        }
        DataTable ICG_SALES_COLLECTION_LIST()
        {
            DataTable ICG_SALES_COLLECTION_TYPE = new DataTable();
            DataColumn COLUMN_HEADER = new DataColumn("ID_VENUE", typeof(int)); ICG_SALES_COLLECTION_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("VENUE", typeof(string)); ICG_SALES_COLLECTION_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("DATE", typeof(DateTime)); ICG_SALES_COLLECTION_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("FRONT", typeof(int)); ICG_SALES_COLLECTION_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("POS", typeof(string)); ICG_SALES_COLLECTION_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("Z", typeof(int)); ICG_SALES_COLLECTION_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("ID_ROOM", typeof(int)); ICG_SALES_COLLECTION_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("ROOM", typeof(string)); ICG_SALES_COLLECTION_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("SERIES", typeof(string)); ICG_SALES_COLLECTION_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("NUMBER", typeof(int)); ICG_SALES_COLLECTION_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("ID_LINE", typeof(int)); ICG_SALES_COLLECTION_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("TIME_START", typeof(string)); ICG_SALES_COLLECTION_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("TIME_END", typeof(string)); ICG_SALES_COLLECTION_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("PAX", typeof(decimal)); ICG_SALES_COLLECTION_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("ID_PAYMENT_TYPE", typeof(int)); ICG_SALES_COLLECTION_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("PAYMENT_TYPE", typeof(string)); ICG_SALES_COLLECTION_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("ID_PAYMENT", typeof(int)); ICG_SALES_COLLECTION_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("PAYMENT", typeof(string)); ICG_SALES_COLLECTION_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("AMOUNT", typeof(decimal)); ICG_SALES_COLLECTION_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("ID_CLIENT", typeof(int)); ICG_SALES_COLLECTION_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("CLIENT", typeof(string)); ICG_SALES_COLLECTION_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("CLIENT_TAX_ID", typeof(string)); ICG_SALES_COLLECTION_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("ADDRESS", typeof(string)); ICG_SALES_COLLECTION_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("POSTCODE", typeof(string)); ICG_SALES_COLLECTION_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("CITY", typeof(string)); ICG_SALES_COLLECTION_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("STATE", typeof(string)); ICG_SALES_COLLECTION_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("COUNTRY", typeof(string)); ICG_SALES_COLLECTION_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("ID_SELLER", typeof(int)); ICG_SALES_COLLECTION_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("SELLER", typeof(string)); ICG_SALES_COLLECTION_TYPE.Columns.Add(COLUMN_HEADER);
            return ICG_SALES_COLLECTION_TYPE;
        }
        DataTable ICG_SALES_LINES_LIST()
        {
            DataTable ICG_SALES_LINES_TYPE = new DataTable();
            DataColumn COLUMN_HEADER = new DataColumn("ID_VENUE", typeof(int)); ICG_SALES_LINES_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("VENUE", typeof(string)); ICG_SALES_LINES_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("DATE", typeof(DateTime)); ICG_SALES_LINES_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("FRONT", typeof(int)); ICG_SALES_LINES_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("POS", typeof(string)); ICG_SALES_LINES_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("Z", typeof(int)); ICG_SALES_LINES_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("ID_ROOM", typeof(int)); ICG_SALES_LINES_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("ROOM", typeof(string)); ICG_SALES_LINES_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("TABLE", typeof(int)); ICG_SALES_LINES_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("ID_RATE", typeof(int)); ICG_SALES_LINES_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("RATE", typeof(string)); ICG_SALES_LINES_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("SERIES", typeof(string)); ICG_SALES_LINES_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("NUMBER", typeof(int)); ICG_SALES_LINES_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("ID_LINE", typeof(int)); ICG_SALES_LINES_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("TIME_LINE", typeof(string)); ICG_SALES_LINES_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("GROSS_PAX", typeof(decimal)); ICG_SALES_LINES_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("NET_PAX", typeof(decimal)); ICG_SALES_LINES_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("ID_DEPT", typeof(int)); ICG_SALES_LINES_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("DEPARTAMENT", typeof(string)); ICG_SALES_LINES_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("ID_SECT", typeof(int)); ICG_SALES_LINES_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("SECTION", typeof(string)); ICG_SALES_LINES_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("ID_ITEM", typeof(int)); ICG_SALES_LINES_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("ITEM", typeof(string)); ICG_SALES_LINES_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("ID_FORMAT", typeof(int)); ICG_SALES_LINES_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("FORMAT", typeof(string)); ICG_SALES_LINES_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("DOSE", typeof(string)); ICG_SALES_LINES_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("SIZE", typeof(string)); ICG_SALES_LINES_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("COLOR", typeof(string)); ICG_SALES_LINES_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("QTY", typeof(decimal)); ICG_SALES_LINES_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("PRICE", typeof(decimal)); ICG_SALES_LINES_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("PRICE_TAX", typeof(decimal)); ICG_SALES_LINES_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("TOTAL_LINE", typeof(decimal)); ICG_SALES_LINES_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("TOTAL_LINE_TAX", typeof(decimal)); ICG_SALES_LINES_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("DISC_LINE", typeof(decimal)); ICG_SALES_LINES_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("DISC_LINE_REASON", typeof(string)); ICG_SALES_LINES_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("DISC_TOTAL", typeof(decimal)); ICG_SALES_LINES_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("DISC_TOTAL_REASON", typeof(string)); ICG_SALES_LINES_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("IS_DISC", typeof(int)); ICG_SALES_LINES_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("NET_DISC_NO_TAX", typeof(decimal)); ICG_SALES_LINES_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("IS_COMPLIMENTARY", typeof(int)); ICG_SALES_LINES_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("IS_COMPLIMENTARY_NO_TAX", typeof(decimal)); ICG_SALES_LINES_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("IS_RETURN", typeof(int)); ICG_SALES_LINES_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("TAX", typeof(decimal)); ICG_SALES_LINES_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("ID_SELLER", typeof(int)); ICG_SALES_LINES_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("SELLER", typeof(string)); ICG_SALES_LINES_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("TYPE", typeof(string)); ICG_SALES_LINES_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("CREDIT_SERIE", typeof(string)); ICG_SALES_LINES_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("CREDIT_NUMBER", typeof(int)); ICG_SALES_LINES_TYPE.Columns.Add(COLUMN_HEADER);
            return ICG_SALES_LINES_TYPE;
        }
        DataTable ICG_SALES_MODIFIERS_LIST()
        {
            DataTable ICG_SALES_MODIFIERS_TYPE = new DataTable();
            DataColumn COLUMN_HEADER = new DataColumn("ID_VENUE", typeof(int)); ICG_SALES_MODIFIERS_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("VENUE", typeof(string)); ICG_SALES_MODIFIERS_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("DATE", typeof(DateTime)); ICG_SALES_MODIFIERS_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("FRONT", typeof(int)); ICG_SALES_MODIFIERS_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("POS", typeof(string)); ICG_SALES_MODIFIERS_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("Z", typeof(int)); ICG_SALES_MODIFIERS_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("ID_ROOM", typeof(int)); ICG_SALES_MODIFIERS_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("ROOM", typeof(string)); ICG_SALES_MODIFIERS_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("TABLE", typeof(int)); ICG_SALES_MODIFIERS_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("SERIES", typeof(string)); ICG_SALES_MODIFIERS_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("NUMBER", typeof(int)); ICG_SALES_MODIFIERS_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("ID_LINE", typeof(int)); ICG_SALES_MODIFIERS_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("ID_MODIF", typeof(string)); ICG_SALES_MODIFIERS_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("ID_DEPT", typeof(int)); ICG_SALES_MODIFIERS_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("DEPARTAMENT", typeof(string)); ICG_SALES_MODIFIERS_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("ID_SECT", typeof(int)); ICG_SALES_MODIFIERS_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("SECTION", typeof(string)); ICG_SALES_MODIFIERS_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("ID_ITEM", typeof(int)); ICG_SALES_MODIFIERS_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("ITEM", typeof(string)); ICG_SALES_MODIFIERS_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("QTY", typeof(decimal)); ICG_SALES_MODIFIERS_TYPE.Columns.Add(COLUMN_HEADER);
            return ICG_SALES_MODIFIERS_TYPE;
        }
        DataTable ICG_ITEMS_LIST()
        {
            DataTable ICG_ITEMS_TYPE = new DataTable();
            DataColumn COLUMN_HEADER = new DataColumn("ARTICLE_NO", typeof(int)); ICG_ITEMS_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("DEPT_NO", typeof(int)); ICG_ITEMS_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("DEPARTAMENT", typeof(string)); ICG_ITEMS_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("SECT_NO", typeof(int)); ICG_ITEMS_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("SECTION", typeof(string)); ICG_ITEMS_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("DESCRIPTION", typeof(string)); ICG_ITEMS_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("FORMAT_NO", typeof(int)); ICG_ITEMS_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("FORMAT", typeof(string)); ICG_ITEMS_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("VAT_NO", typeof(int)); ICG_ITEMS_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("UNLISTED", typeof(string)); ICG_ITEMS_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("PRICEWITHVAT", typeof(decimal)); ICG_ITEMS_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("PRICEWITHOUTVAT", typeof(decimal)); ICG_ITEMS_TYPE.Columns.Add(COLUMN_HEADER);
            return ICG_ITEMS_TYPE;
        }

        public void SaveItemsDataToDB(DataTable dt_IntegrationDetails)
        {
            string[] stringSeparators = new string[] { ":;:" };
            Cashup Obj = new Cashup();
            string[] str = dt_IntegrationDetails.Rows[0]["URL_PARAMETERS"].ToString().Split(stringSeparators, StringSplitOptions.RemoveEmptyEntries);
            int port = Convert.ToInt16(str[1]);
            string host = str[0];
            string username = dt_IntegrationDetails.Rows[0]["USERID"].ToString();
            string password = dt_IntegrationDetails.Rows[0]["PASSWORD"].ToString();
            string remoteDirectory = dt_IntegrationDetails.Rows[0]["URL_PATH"].ToString();
            //"/D:/FTP/LONDON/OUT";
            string remoteitemDirectoryArchive = "/D:/FTP/LONDON/ARCHIVE/Items/" + DateTime.Now.Day.ToString() + DateTime.Now.Month.ToString() + DateTime.Now.Year.ToString();
            string localDirectory = @"D:\Uploads\LIOLONDON\";

            DataTable DtitemFilePath = new DataTable();
            DtitemFilePath.Columns.Add("PATH");
            DtitemFilePath.Columns.Add("FILE_NAME");
            DtitemFilePath.Columns.Add("DATE_NUMBER");

            using (var sftp = new SftpClient(host, port, username, password))
            {
                foreach (DataRow CashUpdr in dt_IntegrationDetails.Rows)
                {
                    if (Convert.ToDecimal(CashUpdr["INTEGRATION_TYPE_ID"]) == 8)
                    {
                        try
                        {
                            LogExceptions.LogInfo("Connect start items files - ICG - ");
                            sftp.Connect();
                            LogExceptions.LogInfo("Connect open items files - ICG - ");
                            var files = sftp.ListDirectory(remoteDirectory);
                            string folderitemName = DateTime.Now.Day.ToString() + DateTime.Now.Month.ToString() + DateTime.Now.Year.ToString();
                            Obj.CashupModelObj = new CashupModel();
                            Obj.CashupModelObj.CASHUP_MAIN_ID = Convert.ToDecimal(CashUpdr["ID"]);
                            Obj.CashupModelObj.BRANCH_ID = Convert.ToDecimal(CashUpdr["BRANCH_ID"]);
                            Obj.CashupModelObj.ENTITY_ID = Convert.ToDecimal(CashUpdr["ENTITY_ID"]);
                            Obj.CashupModelObj.USER_ID = 1;
                            DataTable ICG_ITEMS_DATATABLE = ICG_ITEMS_LIST();
                            int count = 0;
                            foreach (var file in files)
                            {
                                DataRow dr = DtitemFilePath.NewRow();
                                var filename = $"{localDirectory}/{file.Name}";
                                string LocalItemsDirectory2 = localDirectory + "Items" + "\\" + folderitemName + "\\";
                                if (!file.Name.StartsWith("."))
                                {
                                    if (!File.Exists(filename))
                                    {
                                        string[] fileNameSplitArray = file.Name.Split('_');

                                        count = count + 1;

                                        if (fileNameSplitArray[0] == "Items.csv")
                                        {
                                            string remoteFileName = file.Name;
                                            if (remoteFileName != "ARCHIVE")
                                            {
                                                if (Directory.Exists(LocalItemsDirectory2) == false)
                                                {
                                                    Directory.CreateDirectory(LocalItemsDirectory2);
                                                }
                                                using (Stream fileStream = File.Create(LocalItemsDirectory2 + remoteFileName))
                                                {
                                                    string pp = remoteDirectory + "/" + remoteFileName;
                                                    sftp.DownloadFile(remoteDirectory + "/" + remoteFileName, fileStream);
                                                    string path = remoteitemDirectoryArchive + "ARCHIVE_" + remoteFileName;
                                                    DataRow dritem = DtitemFilePath.NewRow();
                                                    dritem[0] = remoteDirectory + "/" + file.Name;
                                                    dritem[1] = file.Name;
                                                    dritem[2] = "Items";
                                                    DtitemFilePath.Rows.Add(dritem);
                                                }
                                                DataTable csvFilereader = ReadExcel(LocalItemsDirectory2 + remoteFileName);
                                                ICG_ITEMS_DATATABLE = ICG_ITEMS(csvFilereader);

                                            }
                                        }
                                    }
                                }
                            }
                            if (ICG_ITEMS_DATATABLE.Rows.Count > 0)
                            {
                                int FLAG = Submititems(ICG_ITEMS_DATATABLE, Convert.ToInt32(dt_IntegrationDetails.Rows[0]["ENTITY_ID"]), Convert.ToInt32(dt_IntegrationDetails.Rows[0]["BRANCH_ID"]), Obj.CashupModelObj.CASHUP_MAIN_ID);
                                if (FLAG == 2)
                                {
                                    for (int i = 0; i < DtitemFilePath.Rows.Count; i++)
                                    {
                                        string sourcefile = localDirectory + "\\" + DtitemFilePath.Rows[i]["DATE_NUMBER"].ToString() + "\\" + folderitemName + "\\" + DtitemFilePath.Rows[i]["FILE_NAME"].ToString();
                                        if (sftp.Exists(remoteitemDirectoryArchive) == false)
                                        {
                                            sftp.CreateDirectory(remoteitemDirectoryArchive);
                                        }
                                        sftp.ChangeDirectory(remoteitemDirectoryArchive);
                                        using (FileStream fs = new FileStream(sourcefile, FileMode.Open))
                                        {
                                            sftp.BufferSize = 4 * 1024;
                                            sftp.UploadFile(fs, Path.GetFileName(sourcefile));
                                        }
                                        sftp.Delete(DtitemFilePath.Rows[i]["PATH"].ToString());
                                        LogExceptions.LogInfo("Delete item File in pending" + DtitemFilePath.Rows[i]["PATH"].ToString());
                                    }
                                }
                            }
                            else
                            {
                                Obj.CashupModelObj.INTEGRATION_STATUS = 4;
                                Obj.CashupModelObj.ERROR_MESSAGE = "";
                                Obj.UPD_CASHUP_MAIN_FOR_INTEGRATION();
                            }
                        }
                        catch (Exception ex)
                        {
                            LogExceptions.LogError("FetchitemFile - ICG - ", ex);
                            Obj.CashupModelObj.INTEGRATION_STATUS = 3;
                            Obj.CashupModelObj.ERROR_MESSAGE = ex.ToString();
                            Obj.UPD_CASHUP_MAIN_FOR_INTEGRATION();
                        }
                        sftp.Disconnect();
                        sftp.Dispose();
                    }
                }

                LogExceptions.LogInfo("Connect closed items files - ICG -");
            }
        }
        public void SaveDataToDB(DataTable dt, DataTable dt_IntegrationDetails)
        {
            string[] stringSeparators = new string[] { ":;:" };
            Cashup Obj = new Cashup();
            string[] str = dt_IntegrationDetails.Rows[0]["URL_PARAMETERS"].ToString().Split(stringSeparators, StringSplitOptions.RemoveEmptyEntries);
            int port = Convert.ToInt16(str[1]);
            string host = str[0];
            string username = dt_IntegrationDetails.Rows[0]["USERID"].ToString();
            string password = dt_IntegrationDetails.Rows[0]["PASSWORD"].ToString();
            /// string remoteDirectory = dt_IntegrationDetails.Rows[0]["URL_PATH"].ToString();
            string remoteDirectory = dt_IntegrationDetails.Rows[0]["URL_PATH"].ToString();
            //"/D:/FTP/LONDON/OUT";
            string remoteDirectoryArchive = "/D:/FTP/LONDON/ARCHIVE/";
            string localDirectory = @"D:\Uploads\LIOLONDON\";
            string remoteitemDirectoryArchive = "/D:/FTP/LONDON/ARCHIVE/Items/" + DateTime.Now.Day.ToString() + DateTime.Now.Month.ToString() + DateTime.Now.Year.ToString();
            string folderitemName = DateTime.Now.Day.ToString() + DateTime.Now.Month.ToString() + DateTime.Now.Year.ToString();

            DataTable DtFilePath = new DataTable();
            DtFilePath.Columns.Add("PATH");
            DtFilePath.Columns.Add("FILE_NAME");
            DtFilePath.Columns.Add("DATE_NUMBER");

            DataTable DtitemFilePath = new DataTable();
            DtitemFilePath.Columns.Add("PATH");
            DtitemFilePath.Columns.Add("FILE_NAME");
            DtitemFilePath.Columns.Add("DATE_NUMBER");
            LogExceptions.LogInfo("Connect Loop Start - ICG - ");
            foreach (DataRow CashUpdr in dt.Rows)
            {
                DtFilePath.Rows.Clear();
                using (var sftp = new SftpClient(host, port, username, password))
                {
                    Obj.CashupModelObj = new CashupModel();
                    Obj.CashupModelObj.CASHUP_MAIN_ID = Convert.ToDecimal(CashUpdr["ID"]);
                    Obj.CashupModelObj.BRANCH_ID = Convert.ToDecimal(CashUpdr["BRANCH_ID"]);
                    Obj.CashupModelObj.ENTITY_ID = Convert.ToDecimal(CashUpdr["ENTITY_ID"]);
                    Obj.CashupModelObj.USER_ID = 1;
                    try
                    {
                        LogExceptions.LogInfo("Connect start files - ICG - ");
                        sftp.Connect();
                        LogExceptions.LogInfo("Connect Open files - ICG - ");
                        var files = sftp.ListDirectory(remoteDirectory);

                        DataTable ICG_SALES_HEADER_DATATABLE = ICG_SALES_HEADER_TYPE_FIELDS();
                        DataTable ICG_SALES_HEADER_TAXES_DATATABLE = ICG_SALES_HEADER_TAXES_LIST();
                        DataTable ICG_SALES_COLLECTION_DATATABLE = ICG_SALES_COLLECTION_LIST();
                        DataTable ICG_SALES_LINES_DATATABLE = ICG_SALES_LINES_LIST();
                        DataTable ICG_SALES_MODIFIERS_DATATABLE = ICG_SALES_MODIFIERS_LIST();
                        DataTable ICG_ITEMS_DATATABLE = ICG_ITEMS_LIST();
                        DateTime datetine = Convert.ToDateTime(CashUpdr["CASHUP_DATE"]);
                        DateTime dtParam;
                        System.Globalization.CultureInfo enGB = new System.Globalization.CultureInfo("en-GB");
                        dtParam = Convert.ToDateTime(datetine, enGB);
                        int day = dtParam.Day; int Month = dtParam.Month; int Year = dtParam.Year;
                        string daystr = day < 10 ? "0" + day.ToString() : day.ToString();
                        string Monthstr = Month < 10 ? "0" + Month.ToString() : Month.ToString();
                        String DateNumber = daystr + "" + Monthstr + "" + Year.ToString();
                        int count = 0;
                        foreach (var file in files)
                        {
                            var filename = $"{localDirectory}/{file.Name}";
                            string LocalDirectory2 = localDirectory + DateNumber + "\\";
                            string LocalItemsDirectory2 = localDirectory + "Items" + "\\" + folderitemName + "\\";
                            if (!file.Name.StartsWith("."))
                            {
                                if (!File.Exists(filename))
                                {
                                    string[] fileNameSplitArray = file.Name.Split('_');
                                    if (fileNameSplitArray[0] == DateNumber || fileNameSplitArray[0] == "Items.csv")
                                    {
                                        string remoteFileName = file.Name;
                                        if (remoteFileName != "ARCHIVE")
                                        {
                                            DataTable csvFilereader = new DataTable();
                                            if (fileNameSplitArray[0] == "Items.csv")
                                            {
                                                LogExceptions.LogInfo("start files -Items.csv");

                                                if (Directory.Exists(LocalItemsDirectory2) == false)
                                                {
                                                    Directory.CreateDirectory(LocalItemsDirectory2);
                                                }
                                                using (Stream fileStream = File.Create(LocalItemsDirectory2 + remoteFileName))
                                                {
                                                    string pp = remoteDirectory + "/" + remoteFileName;
                                                    sftp.DownloadFile(remoteDirectory + "/" + remoteFileName, fileStream);
                                                    string path = remoteitemDirectoryArchive + "ARCHIVE_" + remoteFileName;
                                                    DataRow dritem = DtitemFilePath.NewRow();
                                                    dritem[0] = remoteDirectory + "/" + file.Name;
                                                    dritem[1] = file.Name;
                                                    dritem[2] = "Items";
                                                    DtitemFilePath.Rows.Add(dritem);
                                                }
                                                csvFilereader = ReadExcel(LocalItemsDirectory2 + remoteFileName);
                                                ICG_ITEMS_DATATABLE = ICG_ITEMS(csvFilereader);
                                                LogExceptions.LogInfo("End files -Items fetch successfully");
                                            }
                                            else
                                            {
                                                if (Directory.Exists(LocalDirectory2) == false)
                                                {
                                                    Directory.CreateDirectory(LocalDirectory2);
                                                }
                                                using (Stream fileStream = File.Create(LocalDirectory2 + remoteFileName))
                                                {
                                                    sftp.DownloadFile(remoteDirectory + "/" + remoteFileName, fileStream);
                                                    count = count + 1;
                                                    DataRow dr = DtFilePath.NewRow();
                                                    dr[0] = remoteDirectory + "/" + file.Name;
                                                    dr[1] = file.Name;
                                                    dr[2] = DateNumber;
                                                    DtFilePath.Rows.Add(dr);
                                                }
                                            }
                                            if (fileNameSplitArray[0] == "Items.csv")
                                            {
                                            }
                                            else if (fileNameSplitArray[2] == "salesheaders.csv")
                                            {
                                                csvFilereader = ReadExcel(LocalDirectory2 + remoteFileName);
                                                ICG_SALES_HEADER_DATATABLE = ICG_SALES_HEADER_FY(csvFilereader);
                                            }
                                            else if (fileNameSplitArray[2] == "salestaxes.csv")
                                            {
                                                csvFilereader = ReadExcel(LocalDirectory2 + remoteFileName);
                                                ICG_SALES_HEADER_TAXES_DATATABLE = ICG_SALES_TAXES_FY(csvFilereader);
                                            }
                                            else if (fileNameSplitArray[2] == "salescollections.csv")
                                            {
                                                csvFilereader = ReadExcel(LocalDirectory2 + remoteFileName);
                                                ICG_SALES_COLLECTION_DATATABLE = ICG_SALES_COLLECTIONS(csvFilereader);
                                            }
                                            else if (fileNameSplitArray[2] == "saleslines.csv")
                                            {
                                                csvFilereader = ReadExcel(LocalDirectory2 + remoteFileName);
                                                ICG_SALES_LINES_DATATABLE = ICG_SALES_LINES(csvFilereader);
                                            }
                                            else if (fileNameSplitArray[2] == "salesmodifiers.csv")
                                            {
                                                csvFilereader = ReadExcel(LocalDirectory2 + remoteFileName);
                                                ICG_SALES_MODIFIERS_DATATABLE = ICG_SALES_MODIFIERS(csvFilereader);
                                            }
                                        }
                                    }
                                }
                            }
                        }


                        if (ICG_ITEMS_DATATABLE.Rows.Count > 0)
                        {
                            int FLAG = Submititems(ICG_ITEMS_DATATABLE, Convert.ToInt32(dt_IntegrationDetails.Rows[0]["ENTITY_ID"]), Convert.ToInt32(dt_IntegrationDetails.Rows[0]["BRANCH_ID"]), Obj.CashupModelObj.CASHUP_MAIN_ID);
                            if (FLAG == 2)
                            {
                                for (int i = 0; i < DtitemFilePath.Rows.Count; i++)
                                {
                                    string sourcefile = localDirectory + "\\" + DtitemFilePath.Rows[i]["DATE_NUMBER"].ToString() + "\\" + folderitemName + "\\" + DtitemFilePath.Rows[i]["FILE_NAME"].ToString();
                                    if (sftp.Exists(remoteitemDirectoryArchive) == false)
                                    {
                                        sftp.CreateDirectory(remoteitemDirectoryArchive);
                                    }
                                    sftp.ChangeDirectory(remoteitemDirectoryArchive);
                                    using (FileStream fs = new FileStream(sourcefile, FileMode.Open))
                                    {
                                        sftp.BufferSize = 4 * 1024;
                                        sftp.UploadFile(fs, Path.GetFileName(sourcefile));
                                    }
                                    sftp.Delete(DtitemFilePath.Rows[i]["PATH"].ToString());
                                    LogExceptions.LogInfo("Delete item File in pending" + DtitemFilePath.Rows[i]["PATH"].ToString());
                                }
                            }
                        }
                        if (ICG_SALES_HEADER_DATATABLE.Rows.Count > 0 && ICG_SALES_LINES_DATATABLE.Rows.Count > 0)
                        {
                            int FLAG = SubmitGroup(ICG_SALES_HEADER_DATATABLE, ICG_SALES_LINES_DATATABLE, ICG_SALES_HEADER_TAXES_DATATABLE, ICG_SALES_COLLECTION_DATATABLE, ICG_SALES_MODIFIERS_DATATABLE, Convert.ToInt32(dt_IntegrationDetails.Rows[0]["ENTITY_ID"]), Convert.ToInt32(dt_IntegrationDetails.Rows[0]["BRANCH_ID"]), Obj.CashupModelObj.CASHUP_MAIN_ID);
                            if (FLAG == 2)
                            {
                                for (int i = 0; i < DtFilePath.Rows.Count; i++)
                                {
                                    string sourcefile = localDirectory + "\\" + DtFilePath.Rows[i]["DATE_NUMBER"].ToString() + "\\" + DtFilePath.Rows[i]["FILE_NAME"].ToString();
                                    if (sftp.Exists(remoteDirectoryArchive + DtFilePath.Rows[i]["DATE_NUMBER"]) == false)
                                    {
                                        sftp.CreateDirectory(remoteDirectoryArchive + DtFilePath.Rows[i]["DATE_NUMBER"]);
                                    }
                                    sftp.ChangeDirectory(remoteDirectoryArchive + DtFilePath.Rows[i]["DATE_NUMBER"]);

                                    using (FileStream fs = new FileStream(sourcefile, FileMode.Open))
                                    {
                                        sftp.BufferSize = 4 * 1024;
                                        sftp.UploadFile(fs, Path.GetFileName(sourcefile));
                                    }
                                    sftp.Delete(DtFilePath.Rows[i]["PATH"].ToString());
                                    LogExceptions.LogInfo("Delete File in pending" + DtFilePath.Rows[i]["PATH"].ToString());
                                }

                                //TransformData<DataSet> transformData = new TransformData<DataSet>();
                                //LogExceptions.LogInfo("start calling ICG common epos function");

                                //DataSet LIOLONDON_DS = new DataSet();
                                //LIOLONDON_DS.Tables.Add(ICG_SALES_HEADER_DATATABLE);
                                //LIOLONDON_DS.Tables.Add(ICG_SALES_LINES_DATATABLE);
                                //LIOLONDON_DS.Tables.Add(ICG_SALES_HEADER_TAXES_DATATABLE);
                                //LIOLONDON_DS.Tables.Add(ICG_SALES_COLLECTION_DATATABLE);
                                //LIOLONDON_DS.Tables.Add(ICG_SALES_MODIFIERS_DATATABLE);

                                 
                               
                                //LogExceptions.LogInfo("start calling common epos function");
                                //transformData.DataTransform(IntegrationSource.ICG, dt_IntegrationDetails, LIOLONDON_DS, Obj.CashupModelObj.CASHUP_MAIN_ID, Obj);
                                 

                                Obj.CashupModelObj.INTEGRATION_STATUS = FLAG;
                                Obj.CashupModelObj.ERROR_MESSAGE = "";
                                Obj.UPD_CASHUP_MAIN_FOR_INTEGRATION();
                                DtFilePath.Rows.Clear();
                                //DataTable dt_Session = Common_Methods.GetSessions(Convert.ToDecimal(CashUpdr["ID"]), Convert.ToDecimal(CashUpdr["BRANCH_ID"]));

                                //foreach (DataRow dr_session in dt_Session.Rows)
                                //{
                                //    Obj.CashupModelObj.SESSION_ID = Convert.ToDecimal(dr_session["SESSION_MAPPING_ID"]);
                                //    string Cashup_date = Convert.ToDateTime(CashUpdr["CASHUP_DATE"]).ToString("yyyy-MM-dd");
                                //    string[] timelist = Convert.ToString(dr_session["SESSION_START"]).Split(':');
                                //    int start_hr = Convert.ToInt32(timelist[0]);
                                //    timelist = Convert.ToString(dr_session["SESSION_END"]).Split(':');
                                //    int end_hr = Convert.ToInt32(timelist[0]);
                                //    int variance = start_hr - end_hr;
                                //    DateTime Cashup_date_new = DateTime.Now;
                                //    if (variance == 0 || variance > 0)
                                //    {
                                //        Cashup_date_new = Convert.ToDateTime(Cashup_date).AddDays(1);
                                //    }
                                //    else
                                //    {
                                //        Cashup_date_new = Convert.ToDateTime(Cashup_date);
                                //    }
                                //    string Cashup_start_date = Cashup_date + "T00:00:00";
                                //    string Cashup_end_date = Cashup_date_new.ToString("yyyy-MM-dd") + "T" + Convert.ToString(dr_session["SESSION_END"]);

                                //    MM_SALESDATA.MM_Sales_Data Obj_SalesData = new MM_SALESDATA.MM_Sales_Data();
                                //    Obj_SalesData.Push_MM_Sales_Data(Convert.ToInt32(Obj.CashupModelObj.ENTITY_ID), Convert.ToInt32(Obj.CashupModelObj.BRANCH_ID), Convert.ToDecimal(Obj.CashupModelObj.CASHUP_MAIN_ID), true, null, Convert.ToDateTime(Cashup_start_date));
                                //}
                            }
                        }
                        else
                        {
                            Obj.CashupModelObj.INTEGRATION_STATUS = 4;
                            Obj.CashupModelObj.ERROR_MESSAGE = "";
                            Obj.UPD_CASHUP_MAIN_FOR_INTEGRATION();
                        }
                    }
                    catch (Exception ex)
                    {
                        LogExceptions.LogError("FetchAllFile - ICG - ", ex);
                        Obj.CashupModelObj.INTEGRATION_STATUS = 3;
                        Obj.CashupModelObj.ERROR_MESSAGE = ex.ToString();
                        Obj.UPD_CASHUP_MAIN_FOR_INTEGRATION();
                        if (ex.Message == "An existing connection was forcibly closed by the remote host")
                        {
                            LogExceptions.LogInfo("run error code");
                            Obj.CashupModelObj.INTEGRATION_STATUS = 0;
                            Obj.CashupModelObj.ERROR_MESSAGE = ex.ToString();
                            Obj.UPD_CASHUP_MAIN_FOR_INTEGRATION();
                        }
                    }
                    LogExceptions.LogInfo("Connect Close start files - ICG - ");
                    sftp.Disconnect();
                    sftp.Dispose();
                    LogExceptions.LogInfo("Connect Close files - ICG - ");
                }
            }
        }
        /// <summary>
        /// // Work with a single WorkSheet.
        //you can pass static sheet name like Sheet1 to get that sheet
        //WorkSheet sheet = workbook.GetWorkSheet("Sheet1");
        //You can also use workbook.DefaultWorkSheet to get default in case you want to get first sheet only
        //Convert the worksheet to System.Data.DataTable
        //Boolean parameter sets the first row as column names of your table.
        /// </summary>
        /// <param name="path"></param>
        /// <returns></returns>
        private DataTable ReadExcel(string path)
        {
            //WorkBook workbook = WorkBook.LoadCSV(path, fileFormat: ExcelFileFormat.XLSX, ListDelimiter: ";");
            //WorkSheet sheet = workbook.DefaultWorkSheet;
            DataTable dt = ConvertCsvToDataTable(path, ";");
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
                foreach (string columnName in rows[0].Split(';'))
                    dtData.Columns.Add(columnName);
            }

            //Creating row for each line.(except the first line, which contain column names)
            for (int row = 1; row < rows.Length; row++)
            {
                string[] rowValues = null;
                rowValues = rows[row].Split(';');
                dr = dtData.NewRow();
                dr.ItemArray = rowValues;
                dtData.Rows.Add(dr);
            }

            return dtData;
        }
        public void ShowData(DataTable dtData)
        {
            if (dtData != null && dtData.Rows.Count > 0)
            {
                foreach (DataColumn dc in dtData.Columns)
                {
                    Console.Write(dc.ColumnName + " ");
                }
                Console.WriteLine("\n-----------------------------------------------");

                foreach (DataRow dr in dtData.Rows)
                {
                    foreach (var item in dr.ItemArray)
                    {
                        Console.Write(item.ToString() + "      ");
                    }
                    Console.Write("\n");
                }
                Console.ReadKey();
            }
        }

        public DataTable ICG_SALES_HEADER_FY(DataTable dt)
        {
            DataTable ICG_SALES_HEADER_DATATABLE = ICG_SALES_HEADER_TYPE_FIELDS();
            for (int i = 0; i < dt.Rows.Count; i++)
            {
                DataRow DR_HEADER = ICG_SALES_HEADER_DATATABLE.NewRow();
                DR_HEADER["ID_VENUE"] = dt.Rows[i]["IdVenue"];
                DR_HEADER["VENUE"] = dt.Rows[i]["Venue"];
                DR_HEADER["DATE"] = DateTime.ParseExact(dt.Rows[i]["Date"].ToString(), "dd/MM/yyyy", null);
                DR_HEADER["FRONT"] = dt.Rows[i]["Front"];
                DR_HEADER["POS"] = dt.Rows[i]["Pos"];
                DR_HEADER["Z"] = dt.Rows[i]["Z"];
                DR_HEADER["ID_ROOM"] = dt.Rows[i]["IdRoom"];
                DR_HEADER["ROOM"] = dt.Rows[i]["Room"];
                DR_HEADER["SERIES"] = dt.Rows[i]["Series"];
                DR_HEADER["NUMBER"] = dt.Rows[i]["Number"];
                DR_HEADER["TIME_START"] = dt.Rows[i]["TimeStart"];
                DR_HEADER["TIME_END"] = dt.Rows[i]["TimeEnd"];
                DR_HEADER["PAX"] = dt.Rows[i]["Pax"];
                DR_HEADER["GROSS"] = dt.Rows[i]["Gross"];
                DR_HEADER["TAXES"] = dt.Rows[i]["Taxes"];
                DR_HEADER["DISC_TOTAL"] = dt.Rows[i]["DiscTotal"];
                DR_HEADER["DISC_TOTAL_AMOUNT"] = dt.Rows[i]["DiscTotalAmount"];
                DR_HEADER["TOTAL"] = dt.Rows[i]["Total"];
                DR_HEADER["ID_DISC_TOTAL_REASON"] = dt.Rows[i]["IdDiscTotalReason"];
                DR_HEADER["DISC_TOTAL_REASON"] = dt.Rows[i]["DiscTotalReason"];
                DR_HEADER["ID_SELLER"] = dt.Rows[i]["IdSeller"];
                DR_HEADER["SELLER"] = dt.Rows[i]["Seller"];
                ICG_SALES_HEADER_DATATABLE.Rows.Add(DR_HEADER);
            }
            return ICG_SALES_HEADER_DATATABLE;
        }
        public DataTable ICG_SALES_TAXES_FY(DataTable dt)
        {
            DataTable ICG_SALES_HEADER_TAXES_DATATABLE = ICG_SALES_HEADER_TAXES_LIST();
            for (int i = 0; i < dt.Rows.Count; i++)
            {
                DataRow DR_HEADER = ICG_SALES_HEADER_TAXES_DATATABLE.NewRow();
                DR_HEADER["ID_VENUE"] = dt.Rows[i]["IdVenue"];
                DR_HEADER["VENUE"] = dt.Rows[i]["Venue"];
                DR_HEADER["DATE"] = DateTime.ParseExact(dt.Rows[i]["Date"].ToString(), "dd/MM/yyyy", null);
                DR_HEADER["FRONT"] = dt.Rows[i]["Front"];
                DR_HEADER["POS"] = dt.Rows[i]["Pos"];
                DR_HEADER["Z"] = dt.Rows[i]["Z"];
                DR_HEADER["ID_ROOM"] = dt.Rows[i]["IdRoom"];
                DR_HEADER["ROOM"] = dt.Rows[i]["Room"];
                DR_HEADER["SERIES"] = dt.Rows[i]["Series"];
                DR_HEADER["NUMBER"] = dt.Rows[i]["Number"];
                DR_HEADER["TIME_START"] = dt.Rows[i]["TimeStart"];
                DR_HEADER["TIME_END"] = dt.Rows[i]["TimeEnd"];
                DR_HEADER["PAX"] = dt.Rows[i]["Pax"];
                DR_HEADER["NET"] = dt.Rows[i]["Net"];
                DR_HEADER["TAX"] = dt.Rows[i]["Tax"];
                DR_HEADER["TAX_AMOUNT"] = dt.Rows[i]["TaxAmount"];
                DR_HEADER["TOTAL"] = dt.Rows[i]["Total"];
                DR_HEADER["ID_DISC_TOTAL_REASON"] = dt.Rows[i]["IdDiscTotalReason"];
                DR_HEADER["DISC_TOTAL_REASON"] = dt.Rows[i]["DiscTotalReason"];
                DR_HEADER["ID_SELLER"] = dt.Rows[i]["IdSeller"];
                ICG_SALES_HEADER_TAXES_DATATABLE.Rows.Add(DR_HEADER);
            }

            return ICG_SALES_HEADER_TAXES_DATATABLE;
        }
        public DataTable ICG_SALES_COLLECTIONS(DataTable dt)
        {
            DataTable ICG_SALES_COLLECTION_DATATABLE = ICG_SALES_COLLECTION_LIST();
            for (int i = 0; i < dt.Rows.Count; i++)
            {
                DataRow DR_HEADER = ICG_SALES_COLLECTION_DATATABLE.NewRow();
                DR_HEADER["ID_VENUE"] = dt.Rows[i]["IdVenue"];
                DR_HEADER["VENUE"] = dt.Rows[i]["Venue"];
                DR_HEADER["DATE"] = DateTime.ParseExact(dt.Rows[i]["Date"].ToString(), "dd/MM/yyyy", null);
                DR_HEADER["FRONT"] = dt.Rows[i]["Front"];
                DR_HEADER["POS"] = dt.Rows[i]["Pos"];
                DR_HEADER["Z"] = dt.Rows[i]["Z"];
                DR_HEADER["ID_ROOM"] = dt.Rows[i]["IdRoom"];
                DR_HEADER["ROOM"] = dt.Rows[i]["Room"];
                DR_HEADER["SERIES"] = dt.Rows[i]["Series"];
                DR_HEADER["NUMBER"] = dt.Rows[i]["Number"];
                DR_HEADER["ID_LINE"] = dt.Rows[i]["IdLine"];
                DR_HEADER["TIME_START"] = dt.Rows[i]["TimeStart"];
                DR_HEADER["TIME_END"] = dt.Rows[i]["TimeEnd"];
                DR_HEADER["PAX"] = dt.Rows[i]["Pax"];
                DR_HEADER["ID_PAYMENT_TYPE"] = dt.Rows[i]["IdPaymentType"];
                DR_HEADER["PAYMENT_TYPE"] = dt.Rows[i]["PaymentType"];
                DR_HEADER["ID_PAYMENT"] = dt.Rows[i]["IdPayment"];
                DR_HEADER["PAYMENT"] = dt.Rows[i]["Payment"];
                DR_HEADER["AMOUNT"] = dt.Rows[i]["Amount"];
                DR_HEADER["ID_CLIENT"] = dt.Rows[i]["IdClient"];
                DR_HEADER["CLIENT"] = dt.Rows[i]["Client"];
                DR_HEADER["CLIENT_TAX_ID"] = dt.Rows[i]["ClientTaxId"];
                DR_HEADER["ADDRESS"] = dt.Rows[i]["Address"];
                DR_HEADER["POSTCODE"] = dt.Rows[i]["Postcode"];
                DR_HEADER["CITY"] = dt.Rows[i]["City"];
                DR_HEADER["STATE"] = dt.Rows[i]["State"];
                DR_HEADER["COUNTRY"] = dt.Rows[i]["Country"];
                DR_HEADER["ID_SELLER"] = dt.Rows[i]["IdSeller"];
                DR_HEADER["SELLER"] = dt.Rows[i]["Seller"];
                ICG_SALES_COLLECTION_DATATABLE.Rows.Add(DR_HEADER);
            }
            return ICG_SALES_COLLECTION_DATATABLE;
        }
        public DataTable ICG_SALES_LINES(DataTable dt)
        {
            DataTable ICG_SALES_LINES_DATATABLE = ICG_SALES_LINES_LIST();
            for (int i = 0; i < dt.Rows.Count; i++)
            {
                DataRow DR_HEADER = ICG_SALES_LINES_DATATABLE.NewRow();
                DR_HEADER["ID_VENUE"] = dt.Rows[i]["IdVenue"];
                DR_HEADER["VENUE"] = dt.Rows[i]["Venue"];
                DR_HEADER["DATE"] = DateTime.ParseExact(dt.Rows[i]["Date"].ToString(), "dd/MM/yyyy", null);
                DR_HEADER["FRONT"] = dt.Rows[i]["Front"];
                DR_HEADER["POS"] = dt.Rows[i]["Pos"];
                DR_HEADER["Z"] = dt.Rows[i]["Z"];
                DR_HEADER["ID_ROOM"] = dt.Rows[i]["IdRoom"];
                DR_HEADER["ROOM"] = dt.Rows[i]["Room"];
                DR_HEADER["TABLE"] = dt.Rows[i]["Table"];
                DR_HEADER["ID_RATE"] = dt.Rows[i]["IdRate"];
                DR_HEADER["RATE"] = dt.Rows[i]["Rate"];
                DR_HEADER["SERIES"] = dt.Rows[i]["Series"];
                DR_HEADER["NUMBER"] = dt.Rows[i]["Number"];
                DR_HEADER["ID_LINE"] = dt.Rows[i]["IdLine"];
                DR_HEADER["TIME_LINE"] = dt.Rows[i]["TimeLine"];
                DR_HEADER["GROSS_PAX"] = dt.Rows[i]["GrossPax"];
                DR_HEADER["NET_PAX"] = dt.Rows[i]["NetPax"];
                DR_HEADER["ID_DEPT"] = dt.Rows[i]["IdDept"];
                DR_HEADER["DEPARTAMENT"] = dt.Rows[i]["Departament"];
                DR_HEADER["ID_SECT"] = dt.Rows[i]["IdSect"];
                DR_HEADER["SECTION"] = dt.Rows[i]["Section"];
                DR_HEADER["ID_ITEM"] = dt.Rows[i]["IdItem"];
                DR_HEADER["ITEM"] = dt.Rows[i]["Item"];
                DR_HEADER["ID_FORMAT"] = dt.Rows[i]["IdFormat"];
                DR_HEADER["FORMAT"] = dt.Rows[i]["Format"];

                DR_HEADER["DOSE"] = dt.Rows[i]["Dose"];

                DR_HEADER["SIZE"] = dt.Rows[i]["Size"];
                DR_HEADER["COLOR"] = dt.Rows[i]["Color"];
                DR_HEADER["QTY"] = dt.Rows[i]["Qty"];
                DR_HEADER["PRICE"] = dt.Rows[i]["Price"];
                DR_HEADER["PRICE_TAX"] = dt.Rows[i]["PriceTax"];
                DR_HEADER["TOTAL_LINE"] = dt.Rows[i]["TotalLine"];
                DR_HEADER["TOTAL_LINE_TAX"] = dt.Rows[i]["TotalLineTax"];
                DR_HEADER["DISC_LINE"] = dt.Rows[i]["DiscLine"];
                DR_HEADER["DISC_LINE_REASON"] = dt.Rows[i]["DiscLineReason"];
                DR_HEADER["DISC_TOTAL"] = dt.Rows[i]["DiscTotal"];
                DR_HEADER["DISC_TOTAL_REASON"] = dt.Rows[i]["DiscTotalReason"];
                DR_HEADER["IS_DISC"] = dt.Rows[i]["IsDisc"];
                DR_HEADER["NET_DISC_NO_TAX"] = dt.Rows[i]["NetDiscNoTax"];
                DR_HEADER["IS_COMPLIMENTARY"] = dt.Rows[i]["IsComplementary"].ToString() == "" ? 0 : dt.Rows[i]["IsComplementary"];
                DR_HEADER["IS_COMPLIMENTARY_NO_TAX"] = dt.Rows[i]["IsComplementaryNoTax"].ToString() == "" ? 0 : dt.Rows[i]["IsComplementaryNoTax"];
                DR_HEADER["IS_RETURN"] = dt.Rows[i]["IsReturn"];
                DR_HEADER["TAX"] = dt.Rows[i]["Tax"];
                DR_HEADER["ID_SELLER"] = dt.Rows[i]["IdSeller"];
                DR_HEADER["SELLER"] = dt.Rows[i]["Seller"];
                DR_HEADER["TYPE"] = dt.Rows[i]["Type"];
                DR_HEADER["CREDIT_SERIE"] = dt.Rows[i]["CreditSerie"];
                DR_HEADER["CREDIT_NUMBER"] = dt.Rows[i]["CreditNumber"].ToString() == "" ? 0 : dt.Rows[i]["CreditNumber"];
                ICG_SALES_LINES_DATATABLE.Rows.Add(DR_HEADER);
            }
            return ICG_SALES_LINES_DATATABLE;
        }
        public DataTable ICG_SALES_MODIFIERS(DataTable dt)
        {
            DataTable SALES_MODIFIERS_DATATABLE = ICG_SALES_MODIFIERS_LIST();
            for (int i = 0; i < dt.Rows.Count; i++)
            {
                DataRow DR_HEADER = SALES_MODIFIERS_DATATABLE.NewRow();
                DR_HEADER["ID_VENUE"] = dt.Rows[i]["IdVenue"];
                DR_HEADER["VENUE"] = dt.Rows[i]["Venue"];
                DR_HEADER["DATE"] = DateTime.ParseExact(dt.Rows[i]["Date"].ToString(), "dd/MM/yyyy", null);
                DR_HEADER["FRONT"] = dt.Rows[i]["Front"];
                DR_HEADER["POS"] = dt.Rows[i]["Pos"];
                DR_HEADER["Z"] = dt.Rows[i]["Z"];
                DR_HEADER["ID_ROOM"] = dt.Rows[i]["IdRoom"];
                DR_HEADER["ROOM"] = dt.Rows[i]["Room"];
                DR_HEADER["TABLE"] = dt.Rows[i]["Table"];
                DR_HEADER["SERIES"] = dt.Rows[i]["Series"];
                DR_HEADER["NUMBER"] = dt.Rows[i]["Number"];
                DR_HEADER["ID_LINE"] = dt.Rows[i]["IdLine"];
                DR_HEADER["ID_MODIF"] = dt.Rows[i]["IdModif"];
                DR_HEADER["ID_DEPT"] = dt.Rows[i]["IdDept"];
                DR_HEADER["DEPARTAMENT"] = dt.Rows[i]["Departament"];
                DR_HEADER["ID_SECT"] = dt.Rows[i]["IdSect"];
                DR_HEADER["SECTION"] = dt.Rows[i]["Section"];
                DR_HEADER["ID_ITEM"] = dt.Rows[i]["IdItem"];
                DR_HEADER["ITEM"] = dt.Rows[i]["Item"];
                DR_HEADER["QTY"] = dt.Rows[i]["Qty"];
                SALES_MODIFIERS_DATATABLE.Rows.Add(DR_HEADER);
            }
            return SALES_MODIFIERS_DATATABLE;
        }
        public DataTable ICG_ITEMS(DataTable dt)
        {
            DataTable ITEMS_DATATABLE = ICG_ITEMS_LIST();
            for (int i = 0; i < dt.Rows.Count; i++)
            {
                DataRow DR_HEADER = ITEMS_DATATABLE.NewRow();
                DR_HEADER["ARTICLE_NO"] = dt.Rows[i]["ArticleNo"];
                DR_HEADER["DEPT_NO"] = dt.Rows[i]["DeptNo"];
                DR_HEADER["DEPARTAMENT"] = dt.Rows[i]["Departament"];
                DR_HEADER["SECT_NO"] = dt.Rows[i]["SectNo"];
                DR_HEADER["SECTION"] = dt.Rows[i]["Section"];
                DR_HEADER["DESCRIPTION"] = dt.Rows[i]["Description"];
                DR_HEADER["FORMAT_NO"] = dt.Rows[i]["FormatNo"];
                DR_HEADER["FORMAT"] = dt.Rows[i]["Format"];
                DR_HEADER["VAT_NO"] = dt.Rows[i]["VATno"];
                DR_HEADER["UNLISTED"] = dt.Rows[i]["Unlisted"];
                DR_HEADER["PRICEWITHVAT"] = 0;//dt.Rows[i]["Unlisted"];
                DR_HEADER["PRICEWITHOUTVAT"] = 0;// dt.Rows[i]["Unlisted"];
                ITEMS_DATATABLE.Rows.Add(DR_HEADER);
            }
            return ITEMS_DATATABLE;
        }

        int SubmitGroup(DataTable ICG_SALES_HEADER, DataTable ICG_SALES_LINES, DataTable ICG_SALES_HEADER_TAXES, DataTable ICG_SALES_COLLECTION, DataTable ICG_SALES_MODIFIERS, decimal ENTITY_ID, decimal BRANCH_ID, decimal CASHUP_MAIN_ID)
        {

            Cashup Obj = new Cashup();
            Obj.CashupModelObj = new CashupModel();
            try
            {
                //Save Data in Database

                Cashup _ICashUp = new Cashup();
                _ICashUp.CashupModelObj = new CashupModel();
                _ICashUp.CashupModelObj.CASHUP_MAIN_ID = CASHUP_MAIN_ID;
                _ICashUp.CashupModelObj.ENTITY_ID = ENTITY_ID;
                _ICashUp.CashupModelObj.BRANCH_ID = BRANCH_ID;
                _ICashUp.CashupModelObj.ICG_SALES_HEADER = ICG_SALES_HEADER;
                _ICashUp.CashupModelObj.ICG_SALES_LINES = ICG_SALES_LINES;
                _ICashUp.CashupModelObj.ICG_SALES_HEADER_TAXES = ICG_SALES_HEADER_TAXES;
                _ICashUp.CashupModelObj.ICG_SALES_COLLECTION = ICG_SALES_COLLECTION;
                _ICashUp.CashupModelObj.ICG_SALES_MODIFIERS = ICG_SALES_MODIFIERS;
                _ICashUp.INS_UPD_ICG_DATA();
                return 2;
            }
            catch (Exception ex)
            {
                LogExceptions.LogError(" LightSpeed L Series Product All:- Fail To Saving Data in DB - ", ex);
                Obj.CashupModelObj.INTEGRATION_STATUS = 3;
                Obj.CashupModelObj.ERROR_MESSAGE = ex.ToString();
                Obj.UPD_CASHUP_MAIN_FOR_INTEGRATION();
                return 3;
            }
        }
        int Submititems(DataTable ICG_ITEMS, decimal ENTITY_ID, decimal BRANCH_ID, decimal CASHUP_MAIN_ID)
        {

            Cashup Obj = new Cashup();
            Obj.CashupModelObj = new CashupModel();
            try
            {
                //Save Data in Database

                Cashup _ICashUp = new Cashup();
                _ICashUp.CashupModelObj = new CashupModel();
                _ICashUp.CashupModelObj.CASHUP_MAIN_ID = CASHUP_MAIN_ID;
                _ICashUp.CashupModelObj.ENTITY_ID = ENTITY_ID;
                _ICashUp.CashupModelObj.BRANCH_ID = BRANCH_ID;
                _ICashUp.CashupModelObj.ICG_ITEMS = ICG_ITEMS;
                _ICashUp.INS_UPD_ICG_ITEM_DATA();
                return 2;
            }
            catch (Exception ex)
            {
                LogExceptions.LogError(" ICS  Product All:- Fail To Saving Data in DB - ", ex);
                Obj.CashupModelObj.INTEGRATION_STATUS = 3;
                Obj.CashupModelObj.ERROR_MESSAGE = ex.ToString();
                Obj.UPD_CASHUP_MAIN_FOR_INTEGRATION();
                return 3;
            }
        }

    }
}
