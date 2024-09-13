import * as joi from 'joi';
import { config } from 'dotenv';
import { isString } from 'class-validator';
config();

interface EnvVars {
  PORT: string;
  DATABASE_URL: string;
}

const envSchema = joi
  .object({
    PORT: joi.number().required(),
    DATABASE_URL: joi.string().required(),
  })
  .unknown(true);

const { error, value } = envSchema.validate(process.env);
if (error) throw new Error(`Config validation error: ${error.message}`);

const envVars: EnvVars = value;

export const envs = { port: envVars.PORT, databaseUrl: envVars.DATABASE_URL };
