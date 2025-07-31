import { TreinoWithUsers, ProfissionalInfo, AtletaInfo } from '../features/treino/types';

// Mock de profissionais
export const mockProfissionais: ProfissionalInfo[] = [
  {
    cdUsuario: 1,
    nome: "Dr. João Silva",
    login: "joao.silva",
    email: "joao.silva@sportpro.com",
    cdTpAcesso: 1,
    especialidade: "Educação Física",
    cref: "CREF 123456-G/SP"
  },
  {
    cdUsuario: 2,
    nome: "Dra. Maria Santos",
    login: "maria.santos", 
    email: "maria.santos@sportpro.com",
    cdTpAcesso: 1,
    especialidade: "Fisioterapia",
    cref: "CREFITO 98765-F"
  },
  {
    cdUsuario: 3,
    nome: "Prof. Carlos Lima",
    login: "carlos.lima",
    email: "carlos.lima@sportpro.com", 
    cdTpAcesso: 1,
    especialidade: "Personal Trainer",
    cref: "CREF 555444-G/RJ"
  }
];

// Mock de atletas
export const mockAtletas: AtletaInfo[] = [
  {
    cdUsuario: 10,
    nome: "Ana Costa",
    login: "ana.costa",
    email: "ana.costa@email.com",
    cdTpAcesso: 3,
    idade: 25,
    peso: 65,
    altura: 170
  },
  {
    cdUsuario: 11,
    nome: "Pedro Oliveira",
    login: "pedro.oliveira",
    email: "pedro.oliveira@email.com",
    cdTpAcesso: 3,
    idade: 32,
    peso: 78,
    altura: 180
  },
  {
    cdUsuario: 12,
    nome: "Mariana Ferreira",
    login: "mariana.ferreira",
    email: "mariana.ferreira@email.com",
    cdTpAcesso: 3,
    idade: 28,
    peso: 58,
    altura: 165
  }
];

// Mock de treinos com dados realísticos
export const mockTreinosWithUsers: TreinoWithUsers[] = [
  {
    cdTreino: 1,
    dsTreino: "Programa de Força - Iniciante",
    dtCadastro: new Date("2024-01-15T10:30:00"),
    dtInicio: new Date("2024-02-01"),
    dtFinal: new Date("2024-02-28"),
    obs: "Foco em adaptação muscular e aprendizado de movimentos básicos. Progressão gradual na carga.",
    profissional: mockProfissionais[0], // Dr. João Silva
    atleta: mockAtletas[0], // Ana Costa
    duracaoPlaneada: 28,
    status: 'concluido',
    progresso: 100
  },
  {
    cdTreino: 2,
    dsTreino: "Preparação Cardiovascular - Corrida",
    dtCadastro: new Date("2024-01-20T14:15:00"),
    dtInicio: new Date("2024-02-15"),
    dtFinal: new Date("2024-03-15"),
    obs: "Programa de condicionamento cardiovascular para preparação de meia maratona. Incluir treinos intervalados.",
    profissional: mockProfissionais[2], // Prof. Carlos Lima
    atleta: mockAtletas[1], // Pedro Oliveira
    duracaoPlaneada: 30,
    status: 'em_andamento',
    progresso: 65
  },
  {
    cdTreino: 3,
    dsTreino: "Reabilitação de Joelho",
    dtCadastro: new Date("2024-02-05T09:00:00"),
    dtInicio: new Date("2024-02-10"),
    dtFinal: new Date("2024-04-10"),
    obs: "Programa de reabilitação pós-cirúrgica. Fortalecimento progressivo e recuperação da amplitude de movimento.",
    profissional: mockProfissionais[1], // Dra. Maria Santos
    atleta: mockAtletas[2], // Mariana Ferreira
    duracaoPlaneada: 60,
    status: 'em_andamento',
    progresso: 40
  },
  {
    cdTreino: 4,
    dsTreino: "Hipertrofia Avançada - Upper/Lower",
    dtCadastro: new Date("2024-02-20T16:45:00"),
    dtInicio: new Date("2024-03-01"),
    dtFinal: new Date("2024-05-31"),
    obs: "Programa avançado de hipertrofia com divisão upper/lower. Periodização em blocos.",
    profissional: mockProfissionais[0], // Dr. João Silva
    atleta: mockAtletas[1], // Pedro Oliveira
    duracaoPlaneada: 92,
    status: 'planejado',
    progresso: 0
  }
];

// Função para simular delay de API
export const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Simuladores de API
export const mockApiTreino = {
  async getTreinosWithUsers(): Promise<TreinoWithUsers[]> {
    await delay(800); // Simular delay de rede
    return mockTreinosWithUsers;
  },

  async createTreino(data: any): Promise<TreinoWithUsers> {
    await delay(1200); // Simular processamento
    
    const novoCdTreino = Math.max(...mockTreinosWithUsers.map(t => t.cdTreino)) + 1;
    const profissional = mockProfissionais.find(p => p.cdUsuario === data.cdProfissional);
    const atleta = mockAtletas.find(a => a.cdUsuario === data.cdAtleta);
    
    const novoTreino: TreinoWithUsers = {
      cdTreino: novoCdTreino,
      dsTreino: data.dsTreino,
      dtCadastro: new Date(),
      dtInicio: new Date(data.dtInicio),
      dtFinal: new Date(data.dtFinal),
      obs: data.obs,
      profissional: profissional!,
      atleta: atleta!,
      duracaoPlaneada: Math.ceil((new Date(data.dtFinal).getTime() - new Date(data.dtInicio).getTime()) / (1000 * 60 * 60 * 24)),
      status: 'planejado',
      progresso: 0
    };
    
    mockTreinosWithUsers.push(novoTreino);
    return novoTreino;
  },

  async deleteTreino(cdTreino: number): Promise<boolean> {
    await delay(600);
    const index = mockTreinosWithUsers.findIndex(t => t.cdTreino === cdTreino);
    if (index !== -1) {
      mockTreinosWithUsers.splice(index, 1);
      return true;
    }
    return false;
  }
};

export default mockApiTreino;
