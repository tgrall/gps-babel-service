import { converterParameters } from '@/Models/converterTypes';
import * as child_process from 'child_process';

export class GPSBabel {

    public static convertTrace(params: converterParameters) : string {
        let output;

        const command = `gpsbabel -w -r -t -i ${params.input_format} -f ${params.input_local_file} -o ${params.output_format} -F  ${params.output_file} `;

        try {
            child_process.execSync(command);
            output = params.output_file;
        } catch (error: any) {
            if (error instanceof Error)  {
                output = error.message;
            } else {
                output = "UNKNOWN ERROR";
            }
        }

        return output;
    }


    // get version
    public static getVersion() : string {
        const command = 'gpsbabel -V';
        const result =child_process.execSync(command);
        return result.toString().trim();
    }

}
