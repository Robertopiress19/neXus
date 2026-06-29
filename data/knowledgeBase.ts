import { KnowledgeArticle } from '../types';

export const KNOWLEDGE_BASE: KnowledgeArticle[] = [
  {
    id: 'kb-comp-1',
    title: 'Computador não liga',
    content: `Problema: O computador não mostra nenhum sinal de energia ao pressionar o botão de ligar.

Possíveis Causas e Soluções:

1. Verificação de Energia:
   - Certifique-se de que o cabo de energia está firmemente conectado na tomada e na fonte do computador.
   - Teste a tomada com outro aparelho para garantir que funciona.
   - Verifique se há um interruptor na fonte de alimentação (parte traseira do gabinete) e certifique-se de que está na posição ligado (|).
   - Se usar estabilizador ou nobreak, verifique se estão ligados e funcionando.

2. Hardware Básico:
   - Para notebooks: verifique se a bateria está carregada. Conecte o carregador e aguarde alguns minutos antes de tentar ligar.
   - Desconecte todos os periféricos não essenciais (impressora, HD externo) e tente ligar apenas com teclado e monitor.

3. Componentes Internos:
   - Mau contato de memória RAM: Desligue da tomada, abra o gabinete, remova e reinstale os módulos de memória RAM.
   - Fonte de alimentação defeituosa: Teste com outra fonte conhecida como boa, se possível.
   - Placa-mãe ou processador com defeito: Requer diagnóstico profissional.

Caso nenhuma dessas soluções resolva, pode ser um problema interno de hardware que necessita de assistência técnica especializada.`
  },
  {
    id: 'kb-peri-1',
    title: 'Mouse ou teclado não funcionam',
    content: `Problema: O computador não reconhece o mouse ou teclado, ou eles param de funcionar durante o uso.

Soluções para Dispositivos com Fio:
1. Reconexão: Desconecte e reconecte o cabo USB em uma porta diferente.
2. Porta USB: Teste a porta USB com outro dispositivo para verificar se está funcionando.
3. Reinicialização: Reinicie o computador com o dispositivo conectado.

Soluções para Dispositivos Sem Fio:
1. Bateria: Substitua as pilhas ou recarregue a bateria.
2. Receptor: Verifique se o receptor USB está bem conectado.
3. Emparelhamento: Alguns dispositivos exigem recomeçar o processo de emparelhamento (consulte o manual).

Soluções Avançadas:
1. Gerenciador de Dispositivos: No Windows, pressione Win+X e selecione "Gerenciador de Dispositivos". Verifique se há alertas em "Controladores de seriais universais" ou "Dispositivos de interface humana".
2. Drivers: Desinstale e reinstale os drivers do dispositivo.
3. BIOS/UEFI: Verifique se o dispositivo funciona na tela de configuração da BIOS (isso ajuda a descartar problemas no sistema operacional).

Teste Final: Conecte o mouse ou teclado em outro computador. Se não funcionar, o defeito é muito provavelmente no hardware do periférico.`
  },
  
    {
    id: 'kb-ar-1',
    title: 'Ar condicionado não gela',
    content: `Possíveis Causas:
Falta de energia elétrica: disjuntor desarmado ou fusível queimado.
Problema no controle remoto (baterias fracas ou defeito no próprio remote).
Temperatura no termostato está ajustada acima da ambiente (no modo frio).
Proteção térmica do compressor ativada devido a sobreaquecimento.

Soluções:
Verifique o disjuntor geral e o específico do ar condicionado. Rearme-o se necessário.
Substitua as baterias do controle remoto e teste se o aparelho liga diretamente pelo painel de controle.
Ajuste o termostato para uma temperatura inferior à ambiente.
Espere cerca de 30 minutos para o compressor esfriar e tente ligar novamente. Se o problema persistir, chame um técnico.

Ar Condicionado Liga mas Não Refrigera
Possíveis Causas:
Filtros de ar sujos, obstruindo a passagem de ar.
Bobina evaporadora (unidade interna) ou condensadora (unidade externa) congeladas.
Baixo nível de gás refrigerante (possível vazamento).
Ventilador da unidade externa não funciona ou compressor com defeito.

Soluções:
Limpe os filtros! Esta é a causa mais comum e a mais fácil de resolver. A limpeza deve ser feita a cada 15-30 dias de uso.
Desligue o aparelho e deixe o gelo derreter naturalmente. Verifique e limpe os filtros antes de religar.
Problema técnico. Um vazamento de gás requer detecção e reparo por um técnico qualificado, seguido da recarga do refrigerante. Nunca tente fazer isso sozinho.
Verifique se a hélice do ventilador externo gira. Se não girar, pode ser um problema no capacitor ou no motor. O compressor requer diagnóstico profissional.

Gotejamento ou Vazamento de Água Dentro do Ambiente
Possíveis Causas:
Tubo de dreno obstruído por sujeira, algas ou fungos.
Unidade interna desnivelada, impedindo o escoamento correto da água condensada.
Isolamento térmico dos tubos de cobre danificado, causando condensação excessiva.

Soluções:
Localize o tubo de dreno (geralmente um tubo de PVC saindo da unidade interna) e verifique se há obstruções. Uma aspiração suave ou uma limpeza com água corrente pode resolver.
Certifique-se de que a unidade interna está perfeitamente nivelada (com uma leve inclinação para o lado do dreno).
Inspecione o isolamento dos tubos. Se estiver faltando ou danificado, substitua-o.

Odor Desagradável ao Ligar o Aparelho
Possíveis Causas:
Acúmulo de umidade, poeira e bactérias na bobina evaporadora (interna) ou nos filtros sujos.
Mofo ou bolor no interior da unidade ou no duto de drenagem.

Soluções:
Faça a limpeza regular dos filtros.
Utilize produtos de limpeza específicos para bobinas de ar condicionado (sprays auto-limpantes, seguindo as instruções do fabricante).
Mantenha o aparelho em modo "ventilação" por alguns minutos antes de desligar para secar o interior da unidade.
Em casos graves, pode ser necessário uma limpeza técnica profunda.

Barulho Anormal (Ruído de Batida, Chiado ou Crepitação)
Possíveis Causas:
Trancando ou batendo: Folga em partes mecânicas, como o ventilador (hélice tocando na carcaça) ou motor com rolamento danificado.
Chiado: Possível vazamento de gás refrigerante.
Crepitação/Estalos: Expansão e contração térmica do plástico da carcaça (geralmente normal) ou sujeira na turbina do ventilador.

Soluções:
Para ruídos mecânicos, desligue o aparelho e chame um técnico. Não tente ajustar as hélices com o aparelho ligado.
Um som de chiado é um sinal de alerta para desligar o aparelho e contactar assistência técnica imediatamente.
Limpeza da unidade interna e externa pode eliminar ruídos causados por folhas ou outros detritos.

Baixo Fluxo de Ar ou Pouca Ventilação
Possíveis Causas:
Filtros de ar entupidos.
Ventilador (motor da ventoinha) com defeito ou com velocidade reduzida.
Entupimento das aletas da unidade evaporadora ou condensadora.

Soluções:
Limpe ou substitua os filtros.
Verifique as velocidades do ventilador. Se estiver fraco em todas, pode ser um problema no capacitor do motor ou no próprio motor.
Faça a limpeza das aletas com um pincel macio ou escava própria.`
  },
   {
    id: 'kb-comp-2',
    title: 'Computador está lento',
    content: `Problema: O computador demora para responder, programas travam ou o sistema opera com geral lentidão.

Soluções Imediatas (Quick Fixes):
1. Reinicialização: Reinicie o computador. Isso limpa a memória RAM e interrompe processos que podem estar consumindo recursos.
2. Gerenciador de Tarefas: Pressione Ctrl+Shift+Esc para abri-lo. Ordene por "CPU", "Memória" e "Disco" para identificar programas que estão usando muitos recursos. Feche aplicativos não usados.
3. Inicialização: Limpe a inicialização do sistema. No Gerenciador de Tarefas, vá para a aba "Inicialização" e desative programas desnecessários que iniciam com o Windows.

Limpeza e Manutenção:
1. Espaço em Disco: Verifique o espaço livre no disco principal (C:). Mantenha pelo menos 15-20% livre. Use a "Limpeza de Disco" do Windows para remover arquivos temporários.
2. Desfragmentação (HDD): Se você usa um HD mecânico (não SSD), execute o "Desfragmentar e Otimizar Unidades".
3. Verificação de Malware: Execute uma verificação completa com seu antivírus e considere usar uma ferramenta secundária como Malwarebytes.

Soluções Avançadas:
1. Atualizações: Mantenha o Windows e os drivers (especialmente de vídeo e chipset) atualizados.
2. Hardware: 
   - Adicione mais memória RAM (8GB é o mínimo recomendado para uso geral hoje).
   - Substitua o HD por um SSD (Solid State Drive). Esta é a melhoria de performance mais significativa para a maioria dos computadores.
3. Reset/Restauração: Se o problema persistir, considere usar "Restaurar o sistema" para um ponto anterior ou realizar uma reinstalação limpa do Windows.

Problemas de Superaquecimento:
- Computadores lentos podem ser devido ao throttling térmico (quando o processador reduz sua velocidade para esfriar). Verifique se as ventoinhas estão funcionando e se as entradas de ar não estão obstruídas por poeira.`
  },
    {
    id: 'kb-comp-3',
    title: 'Tela azul (Blue Screen of Death - BSOD)',
    content: `Problema: O Windows para de funcionar repentinamente e exibe uma tela azul com uma mensagem de erro.

O Que Fazer Imediatamente:
1. Anote o código de erro: Ele é a chave para identificar o problema. Exemplos: CRITICAL_PROCESS_DIED, IRQL_NOT_LESS_OR_EQUAL, PAGE_FAULT_IN_NONPAGED_AREA.
2. Reinicie: Normalmente o computador reiniciará automaticamente após alguns segundos.

Causas Comuns e Soluções:
1. Drivers Problemáticos: A causa mais comum de BSODs, especialmente após instalar novo hardware ou software.
   - Inicie o Windows no Modo de Segurança (pressione F8 durante a inicialização ou via Configurações > Atualização e Segurança > Recuperação).
   - Desinstale drivers recentemente atualizados ou hardware adicionado.
   - Use o "Verificador de Driver" (Driver Verifier) do Windows para diagnóstico avançado (uso com cautela).

2. Hardware com Defeito:
   - Memória RAM: Teste usando a ferramenta "Windows Memory Diagnostic" (pesquisar no menu Iniciar).
   - Disco Rígido (HDD/SSD): Verifique a integridade com o comando \`chkdsk C: /f\` no Prompt de Comando como Administrador.
   - Superaquecimento: Monitore a temperatura da CPU e GPU com ferramentas como HWMonitor.

3. Corrupção de Arquivos do Sistema:
   - Abra o Prompt de Comando como Administrador e execute: \`sfc /scannow\`
   - Se o SFC não resolver, execute: \`DISM /Online /Cleanup-Image /RestoreHealth\`

4. Atualizações de Sistema ou BIOS:
   - Instale todas as atualizações pendentes do Windows.
   - Verifique no site do fabricante da placa-mãe se há uma atualização de BIOS/UEFI disponível (ATENÇÃO: atualizar a BIOS é um processo sensível, siga as instruções com rigor).

Se os erros persistirem, a mensagem de erro específica é crucial para buscar uma solução precisa em fóruns técnicos.`
  },


{

  id: 'kb-comp-4',
    title: 'Sem conexão com a internet',
    content: `Problema: O computador não consegue se conectar à internet, mesmo parecendo que a rede está funcionando.

Diagnóstico Básico:
1. Verifique outros dispositivos: Teste se outros dispositivos (celular, outro PC) se conectam à mesma rede Wi-Fi ou cabo. Se não conectarem, o problema é no roteador ou provedor.
2. Modo Avião: Certifique-se de que o "Modo Avião" não está ativado no Windows (central de notificações).
3. Conexão por Cabo: Se usa Wi-Fi, tente conectar um cabo de rede diretamente ao roteador para descartar problemas com o adaptador wireless.

Soluções no Computador:
1. Reinicie o roteador e o computador.
2. Solução de Problemas: Clique com o botão direito no ícone de rede na bandeja do sistema e selecione "Solucionar problemas". O Windows tentará diagnosticar e reparar automaticamente.
3. Driver de Rede: 
   - Acesse o Gerenciador de Dispositivos (Win+X + M).
   - Expanda "Adaptadores de rede".
   - Clique com o botão direito no seu adaptador (Wi-Fi ou Ethernet) e selecione "Atualizar driver".
   - Se não resolver, "Desinstalar o dispositivo" e reinicie o PC para reinstalar o driver.

Configurações Avançadas:
1. TCP/IP: Redefina a pilha de protocolos de rede. Abra o Prompt de Comando como Administrador e execute estes comandos, um por um:
   - \`netsh winsock reset\`
   - \`netsh int ip reset\`
   - \`ipconfig /release\`
   - \`ipconfig /renew\`
   - \`ipconfig /flushdns\`
Reinicie o computador após executar os comandos.

2. Firewall/Antivírus: Verifique temporariamente se o firewall ou antivírus não está bloqueando a conexão. Tente desativá-los por um minuto para testar.

Caso nenhuma solução funcione, o problema pode ser físico (adaptador de rede defeituoso) e pode exigir a substituição do hardware ou uso de um adaptador USB de rede.`
  }
];