import { converterParameters } from '@/Models/converterTypes';
import * as child_process from 'child_process';

export class GPSBabel {
    
    public static async convertTrace(params: converterParameters) : Promise<String> {
        let output:String = "to_process";


        const command = `gpsbabel -w -r -t -i ${params.input_format} -f ${params.input_local_file} -o ${params.output_format} -F  ${params.output_file} `;
        
        try { 
            const result = await child_process.execSync(command);
            output = params.output_file;
        } catch (error :any) {
            output = error.toString().trim();
        }
        
        return output;
    }


    // get version
    public static async getVersion() : Promise<String> {
        const command = 'gpsbabel -V';
        const result =await child_process.execSync(command);
        
        return result.toString().trim();
    }

}
