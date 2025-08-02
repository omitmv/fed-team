// Tipos relacionados aos treinos

export interface Exercicio {
  id: string;
  nome: string;
  descricao?: string;
  grupoMuscular: string;
  equipamento?: string;
  instrucoes?: string;
  imagemUrl?: string;
}

export interface Serie {
  id: string;
  exercicioId: string;
  repeticoes: number;
  peso?: number;
  tempo?: number; // em segundos
  descanso?: number; // em segundos
  observacoes?: string;
}

export interface Treino {
  cdTreino: number; // chave primária auto-incrementável
  dsTreino: string; // nome do treino, único, máx 250 chars
  dtCadastro: Date; // data de cadastro (padrão: now)
  dtInicio: Date; // data de início obrigatória
  dtFinal: Date; // data final obrigatória
  cdProfissional: number; // FK para tbUsuario (profissional)
  nomeProfissional?: string; // nome do profissional, opcional
  cdAtleta: number; // FK para tbUsuario (atleta)
  nomeAtleta?: string; // nome do atleta, opcional
  obs?: string; // observações, máx 2500 chars
}

export interface TreinoCreate {
  dsTreino: string; // nome do treino
  dtInicio: Date; // data de início
  dtFinal: Date; // data final
  cdProfissional: number; // ID do profissional
  cdAtleta: number; // ID do atleta
  obs?: string; // observações
}

export interface TreinoUpdate {
  dsTreino?: string; // nome do treino, opcional
  dtInicio?: Date; // data de início, opcional
  dtFinal?: Date; // data final, opcional
  cdProfissional?: number; // ID do profissional, opcional
  cdAtleta?: number; // ID do atleta, opcional
  obs?: string; // observações, opcional
}

export interface SessaoTreino {
  id: string;
  cdTreino: number; // referência ao treino
  cdAtleta: number; // referência ao atleta
  dataInicio: Date;
  dataFim?: Date;
  series: SerieExecutada[];
  observacoes?: string;
  avaliacaoRpe?: number; // Rate of Perceived Exertion (1-10)
}

export interface SerieExecutada {
  id: string;
  serieId: string;
  exercicioId: string;
  repeticoesExecutadas: number;
  pesoExecutado?: number;
  tempoExecutado?: number;
  completada: boolean;
  observacoes?: string;
}

export interface TreinoCreateRequest {
  dsTreino: string;
  dtInicio: Date;
  dtFinal: Date;
  cdProfissional: number;
  cdAtleta: number;
  obs?: string;
}

export interface TreinoUpdateRequest {
  cdTreino: number;
  dsTreino?: string;
  dtInicio?: Date;
  dtFinal?: Date;
  cdProfissional?: number;
  cdAtleta?: number;
  obs?: string;
}

export interface ExercicioFormData {
  nome: string;
  descricao?: string;
  grupoMuscular: string;
  equipamento?: string;
  instrucoes?: string;
}

export interface SerieFormData {
  exercicioId: string;
  repeticoes: number;
  peso?: number;
  tempo?: number;
  descanso?: number;
  observacoes?: string;
}

// Interfaces para usuários relacionados ao treino
export interface UsuarioTreino {
  cdUsuario: number;
  nome: string;
  login: string;
  email?: string;
  cdTpAcesso: number;
}

export interface ProfissionalInfo extends UsuarioTreino {
  especialidade?: string;
  cref?: string;
}

export interface AtletaInfo extends UsuarioTreino {
  idade?: number;
  peso?: number;
  altura?: number;
}

// Interface para listagem de treinos com informações dos usuários
export interface TreinoWithUsers {
  cdTreino: number;
  dsTreino: string;
  dtCadastro: Date;
  dtInicio: Date;
  dtFinal: Date;
  obs?: string;
  profissional: ProfissionalInfo;
  atleta: AtletaInfo;
  
  // Campos calculados/extras
  duracaoPlaneada?: number; // dias entre dtInicio e dtFinal
  status?: 'planejado' | 'em_andamento' | 'concluido' | 'cancelado';
  progresso?: number; // percentual de conclusão
}
