import { ArgumentsHost, BadRequestException, Catch, ExceptionFilter } from "@nestjs/common";
import { Response } from "express";

@Catch(BadRequestException)
export class BadRequestExceptionFilter<T extends BadRequestException> implements ExceptionFilter {

    catch(exception: T, host: ArgumentsHost) {
        const ctx = host.switchToHttp()
        const response = ctx.getResponse<Response>();

        const status = exception.getStatus();
        const exceptionResponse = exception.getResponse();

        console.log('FILTER::::::', exceptionResponse)
        response.status(status).json({
            code: status,
            error: exceptionResponse.toString()
        })
    }
}