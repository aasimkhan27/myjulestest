using System.Linq;
using System.Web;
using System.Web.Optimization;

namespace WebApplication
{
    public class BundleConfig
    {
        // For more information on bundling, visit http://go.microsoft.com/fwlink/?LinkId=301862
        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.Add(new ScriptBundle("~/bundles/jquery").Include(
                        "~/E_Scripts/jquery-{version}.js"));

            bundles.Add(new ScriptBundle("~/bundles/jqueryval").Include(
                        "~/E_Scripts/jquery.validate*"));

            // Use the development version of Modernizr to develop with and learn from. Then, when you're
            // ready for production, use the build tool at http://modernizr.com to pick only the tests you need.
            bundles.Add(new ScriptBundle("~/bundles/modernizr").Include(
                        "~/E_Scripts/modernizr-*"));

            bundles.Add(new ScriptBundle("~/Scripts/Login").Include(
                                     "~/E_Scripts/jquery-3.5.1.min.js",
                        "~/E_Scripts/jquery-migrate-3.3.0.min.js",
                            "~/E_Scripts/bootstrap.min.js",
                            "~/E_Content/assets/js/app.js",
                            "~/E_Scripts/SHA1_Encryption.js"));

            bundles.Add(new ScriptBundle("~/bundles/bootstrap").Include(
                            "~/E_Scripts/bootstrap.js",
                            "~/E_Scripts/respond.js"));

            bundles.Add(new ScriptBundle("~/Scripts/Main").Include(
                                   "~/E_Scripts/jquery-3.5.1.min.js",
                        "~/E_Scripts/jquery-migrate-3.3.0.min.js",
                        "~/E_Scripts/bootstrap.min.js",
                        "~/E_Content/assets/plugins/flexslider/jquery.flexslider-min.js",
                        "~/E_Content/assets/js/app.js"));

            bundles.Add(new ScriptBundle("~/Scripts/Common").Include(
                      "~/E_Scripts/angular.min.js",
                      "~/E_Scripts/angular-cookies.min.js",
                        "~/E_Scripts/angular-route.min.js",
                      "~/E_Scripts/angular-animate.min.js",
                      "~/AngularControllers/MasterController.js",
                      "~/E_Scripts/ngStorage.min.js",
                      "~/E_Scripts/angular-drag-and-drop-lists.min.js"));

            bundles.Add(new StyleBundle("~/Content/css").Include(
                            "~/E_Content/bootstrap.css",
                            "~/E_Content/site.css"));


            bundles.Add(new StyleBundle("~/Content/css/Login").IncludeWithCssRewriteUrlTransform(
                            "~/E_Content/bootstrap.min.css",
                            "~/E_Content/assets/css/app.css",
                            "~/E_Content/assets/css/plugins.css",
                            "~/E_Content/assets/css/ie8.css",
                            "~/E_Content/assets/css/plugins/animate.css",
                            "~/E_Content/assets/css/plugins/box-shadows.css",
                            "~/E_Content/assets/css/style.css",
                            "~/E_Content/assets/css/pages/page_log_reg_v1.css",
                            "~/E_Content/assets/css/themes/default.css",
                            "~/E_Content/assets/css/custom.css"));

            bundles.Add(new StyleBundle("~/Content/css/LoginNew").IncludeWithCssRewriteUrlTransform(
                            "~/E_Content/bootstrap.min.css",
                            "~/E_Content/iconic/css/material-design-iconic-font.min.css",
                            "~/E_Content/css/util.css",
                            "~/E_Content/css/main.css"));

            bundles.Add(new StyleBundle("~/Content/css/Main").IncludeWithCssRewriteUrlTransform(
                    "~/E_Content/bootstrap.min.css",
                    "~/E_Content/assets/css/app.css",
                    "~/E_Content/assets/css/plugins.css",
                    "~/E_Content/assets/css/ie8.css",
                    "~/E_Content/assets/css/plugins/animate.css",
                    "~/E_Content/assets/css/plugins/box-shadows.css",
                    "~/E_Content/assets/css/style.css",
                    "~/E_Content/css/header-footer.css",
                    "~/E_Content/assets/css/pages/page_search.css",
                    "~/E_Content/assets/plugins/line-icons/line-icons.css",
                    "~/E_Content/assets/css/themes/default.css",
                    "~/E_Content/assets/css/custom.css",
                    "~/E_Content/css/product.css"));



            bundles.Add(new StyleBundle("~/E_Content/css/Main_Login").Include(
           "~/E_Content/plugins/fontawesome-free/css/all.min.css",
           "~/E_Content/dist/css/adminlte.min.css",
           "~/E_Content/CustomCss/Custom_login.css"
           ));
            bundles.Add(new ScriptBundle("~/E_Content/Scripts/Main_Login").Include(
               "~/E_Content/plugins/jquery/jquery.min.js",
               "~/E_Content/plugins/jquery-ui/jquery-ui.min.js",
               "~/E_Content/plugins/bootstrap/js/bootstrap.bundle.min.js",
               "~/E_Scripts/SHA1_Encryption.js"
               ));

            bundles.Add(new ScriptBundle("~/E_Scripts/Common").Include(
     "~/E_Scripts/angular.min.js",
     "~/E_Scripts/angular-cookies.min.js",
     "~/E_Scripts/angular-route.min.js",
     "~/E_Scripts/angular-animate.min.js",
     "~/AngularControllers/MasterController.js",
     "~/E_Scripts/ngStorage.min.js"));

            bundles.Add(new StyleBundle("~/E_Content/css/Main").Include(
                "~/E_Content/plugins/fontawesome-free/css/all.min.css",
                "~/E_Content/assets/css/plugins/animate.css",
                "~/E_Content/plugins/overlayScrollbars/css/OverlayScrollbars.min.css",
                "~/E_Content/dist/css/adminlte.min.css"
                ));
            bundles.Add(new ScriptBundle("~/E_Content/Scripts/Main").Include(
                "~/E_Content/plugins/jquery/jquery.min.js",
    "~/E_Content/plugins/bootstrap/js/bootstrap.bundle.min.js",
    "~/E_Content/plugins/overlayScrollbars/js/jquery.overlayScrollbars.min.js",
    "~/E_Content/dist/js/adminlte.min.js"
                ));
            bundles.Add(new ScriptBundle("~/E_Content/Scripts/Bottom").Include(
           "~/E_Content/js/fastclick.js",
           "~/E_Content/nprogress/nprogress.js",
           "~/E_Content/scrollbar/jquery.mCustomScrollbar.concat.min.js",
           "~/E_Content/custom/js/custom.min.js"
           ));


            bundles.Add(new StyleBundle("~/E_Content/css/PI_Main").Include(
              "~/E_Content/plugins/fontawesome-free/css/all.min.css",
              "~/E_Content/assets/css/plugins/animate.css",
              "~/E_Content/plugins/overlayScrollbars/css/OverlayScrollbars.min.css",
              //"~/E_Content/CustomCss/HR/Vendors/fontawesome-pro-6.5.1-web/css/light.css",
              //"~/E_Content/CustomCss/HR/Vendors/fontawesome-pro-6.5.1-web/css/regular.css",
              //"~/E_Content/CustomCss/HR/Vendors/fontawesome-pro-6.5.1-web/css/solid.css",
              //"~/E_Content/CustomCss/HR/Vendors/fontawesome-pro-6.5.1-web/css/brands.css",
              //"~/E_Content/CustomCss/HR/Vendors/bootstrap/bootstrap.css",
              "~/E_Content/CustomCss/HR/Vendors/Countries/intltelinput.min.css"
              ));
            bundles.Add(new ScriptBundle("~/E_Content/Scripts/PI_Main").Include(
                "~/E_Content/plugins/jquery/jquery.min.js",
    "~/E_Content/plugins/bootstrap/js/bootstrap.bundle.min.js",
    "~/E_Content/plugins/overlayScrollbars/js/jquery.overlayScrollbars.min.js"
    
                ));



        }
    }

    public static class BundleExtensions
    {

        /// <summary>
        /// Applies the CssRewriteUrlTransform to every path in the array.
        /// </summary>      
        public static Bundle IncludeWithCssRewriteUrlTransform(this Bundle bundle, params string[] virtualPaths)
        {
            //Ensure we add CssRewriteUrlTransform to turn relative paths (to images, etc.) in the CSS files into absolute paths.
            //Otherwise, you end up with 404s as the bundle paths will cause the relative paths to be off and not reach the static files.

            if ((virtualPaths != null) && (virtualPaths.Any()))
            {
                virtualPaths.ToList().ForEach(path =>
                {
                    bundle.Include(path, new CssRewriteUrlTransform());
                });
            }

            return bundle;
        }
    }
}
