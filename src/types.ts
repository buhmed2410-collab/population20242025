/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface AgeGroup {
  range: string;
  male: number;
  female: number;
  total: number;
}

export interface WilayatData {
  name: string;
  total: number;
  omani: number;
  expat: number;
  male: number;
  female: number;
}

export interface DhofarCensusYearData {
  total: number;
  omani: number;
  expat: number;
  wilayats: WilayatData[];
}
