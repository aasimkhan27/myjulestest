﻿using System;
using System.Net;
using System.Net.Http;

namespace Wenodo.Integration.CustomException
{
    public class HttpRequestExceptionEx:  HttpRequestException
    {
        public HttpStatusCode HttpCode { get; }

        public HttpRequestExceptionEx(HttpStatusCode code) : this(code, null, null)
        {
        }

        public HttpRequestExceptionEx(HttpStatusCode code, string message) : this(code, message, null)
        {
        }

        public HttpRequestExceptionEx(HttpStatusCode code, string message, Exception inner) : base(message, inner)
        {
            HttpCode = code;
        }
    }
}
