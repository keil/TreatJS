'use strict';
function GameBoyCore(canvas, ROMImage) {
    this.canvas = canvas;
    this.drawContext = null;
    this.ROMImage = ROMImage;
    this.registerA = 1;
    this.FZero = true;
    this.FSubtract = false;
    this.FHalfCarry = true;
    this.FCarry = true;
    this.registerB = 0;
    this.registerC = 19;
    this.registerD = 0;
    this.registerE = 216;
    this.registersHL = 333;
    this.stackPointer = 65534;
    this.programCounter = 256;
    this.CPUCyclesTotal = 0;
    this.CPUCyclesTotalBase = 0;
    this.CPUCyclesTotalCurrent = 0;
    this.CPUCyclesTotalRoundoff = 0;
    this.baseCPUCyclesPerIteration = 0;
    this.remainingClocks = 0;
    this.inBootstrap = true;
    this.usedBootROM = false;
    this.usedGBCBootROM = false;
    this.halt = false;
    this.skipPCIncrement = false;
    this.stopEmulator = 3;
    this.IME = true;
    this.IRQLineMatched = 0;
    this.interruptsRequested = 0;
    this.interruptsEnabled = 0;
    this.hdmaRunning = false;
    this.CPUTicks = 0;
    this.doubleSpeedShifter = 0;
    this.JoyPad = 255;
    this.CPUStopped = false;
    this.memoryReader = [];
    this.memoryWriter = [];
    this.memoryHighReader = [];
    this.memoryHighWriter = [];
    this.ROM = [];
    this.memory = [];
    this.MBCRam = [];
    this.VRAM = [];
    this.GBCMemory = [];
    this.MBC1Mode = false;
    this.MBCRAMBanksEnabled = false;
    this.currMBCRAMBank = 0;
    this.currMBCRAMBankPosition = -40960;
    this.cGBC = false;
    this.gbcRamBank = 1;
    this.gbcRamBankPosition = -53248;
    this.gbcRamBankPositionECHO = -61440;
    this.RAMBanks = [
        0,
        1,
        2,
        4,
        16
    ];
    this.ROMBank1offs = 0;
    this.currentROMBank = 0;
    this.cartridgeType = 0;
    this.name = '';
    this.gameCode = '';
    this.fromSaveState = false;
    this.savedStateFileName = '';
    this.STATTracker = 0;
    this.modeSTAT = 0;
    this.spriteCount = 252;
    this.LYCMatchTriggerSTAT = false;
    this.mode2TriggerSTAT = false;
    this.mode1TriggerSTAT = false;
    this.mode0TriggerSTAT = false;
    this.LCDisOn = false;
    this.LINECONTROL = [];
    this.DISPLAYOFFCONTROL = [_wrap_(function (parentObj) {
        })];
    this.LCDCONTROL = null;
    this.initializeLCDController();
    this.RTCisLatched = false;
    this.latchedSeconds = 0;
    this.latchedMinutes = 0;
    this.latchedHours = 0;
    this.latchedLDays = 0;
    this.latchedHDays = 0;
    this.RTCSeconds = 0;
    this.RTCMinutes = 0;
    this.RTCHours = 0;
    this.RTCDays = 0;
    this.RTCDayOverFlow = false;
    this.RTCHALT = false;
    this.highX = 127;
    this.lowX = 127;
    this.highY = 127;
    this.lowY = 127;
    this.audioHandle = null;
    this.numSamplesTotal = 0;
    this.sampleSize = 0;
    this.dutyLookup = [
        [
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            true
        ],
        [
            true,
            false,
            false,
            false,
            false,
            false,
            false,
            true
        ],
        [
            true,
            false,
            false,
            false,
            false,
            true,
            true,
            true
        ],
        [
            false,
            true,
            true,
            true,
            true,
            true,
            true,
            false
        ]
    ];
    this.currentBuffer = [];
    this.bufferContainAmount = 0;
    this.LSFR15Table = null;
    this.LSFR7Table = null;
    this.noiseSampleTable = null;
    this.initializeAudioStartState();
    this.soundMasterEnabled = false;
    this.channel3PCM = null;
    this.VinLeftChannelMasterVolume = 8;
    this.VinRightChannelMasterVolume = 8;
    this.leftChannel1 = false;
    this.leftChannel2 = false;
    this.leftChannel3 = false;
    this.leftChannel4 = false;
    this.rightChannel1 = false;
    this.rightChannel2 = false;
    this.rightChannel3 = false;
    this.rightChannel4 = false;
    this.channel1currentSampleLeft = 0;
    this.channel1currentSampleRight = 0;
    this.channel2currentSampleLeft = 0;
    this.channel2currentSampleRight = 0;
    this.channel3currentSampleLeft = 0;
    this.channel3currentSampleRight = 0;
    this.channel4currentSampleLeft = 0;
    this.channel4currentSampleRight = 0;
    this.channel1currentSampleLeftSecondary = 0;
    this.channel1currentSampleRightSecondary = 0;
    this.channel2currentSampleLeftSecondary = 0;
    this.channel2currentSampleRightSecondary = 0;
    this.channel3currentSampleLeftSecondary = 0;
    this.channel3currentSampleRightSecondary = 0;
    this.channel4currentSampleLeftSecondary = 0;
    this.channel4currentSampleRightSecondary = 0;
    this.channel1currentSampleLeftTrimary = 0;
    this.channel1currentSampleRightTrimary = 0;
    this.channel2currentSampleLeftTrimary = 0;
    this.channel2currentSampleRightTrimary = 0;
    this.mixerOutputCache = 0;
    this.initializeTiming();
    this.machineOut = 0;
    this.audioTicks = 0;
    this.audioIndex = 0;
    this.rollover = 0;
    this.emulatorTicks = 0;
    this.DIVTicks = 56;
    this.LCDTicks = 60;
    this.timerTicks = 0;
    this.TIMAEnabled = false;
    this.TACClocker = 1024;
    this.serialTimer = 0;
    this.serialShiftTimer = 0;
    this.serialShiftTimerAllocated = 0;
    this.IRQEnableDelay = 0;
    var dateVar = new_Date();
    this.lastIteration = dateVar.getTime();
    dateVar = new_Date();
    this.firstIteration = dateVar.getTime();
    this.iterations = 0;
    this.actualScanLine = 0;
    this.lastUnrenderedLine = 0;
    this.queuedScanLines = 0;
    this.totalLinesPassed = 0;
    this.haltPostClocks = 0;
    this.cMBC1 = false;
    this.cMBC2 = false;
    this.cMBC3 = false;
    this.cMBC5 = false;
    this.cMBC7 = false;
    this.cSRAM = false;
    this.cMMMO1 = false;
    this.cRUMBLE = false;
    this.cCamera = false;
    this.cTAMA5 = false;
    this.cHuC3 = false;
    this.cHuC1 = false;
    this.cTIMER = false;
    this.ROMBanks = [
        2,
        4,
        8,
        16,
        32,
        64,
        128,
        256,
        512
    ];
    this.ROMBanks[82] = 72;
    this.ROMBanks[83] = 80;
    this.ROMBanks[84] = 96;
    this.numRAMBanks = 0;
    this.currVRAMBank = 0;
    this.backgroundX = 0;
    this.backgroundY = 0;
    this.gfxWindowDisplay = false;
    this.gfxSpriteShow = false;
    this.gfxSpriteNormalHeight = true;
    this.bgEnabled = true;
    this.BGPriorityEnabled = true;
    this.gfxWindowCHRBankPosition = 0;
    this.gfxBackgroundCHRBankPosition = 0;
    this.gfxBackgroundBankOffset = 128;
    this.windowY = 0;
    this.windowX = 0;
    this.drewBlank = 0;
    this.drewFrame = false;
    this.midScanlineOffset = -1;
    this.pixelEnd = 0;
    this.currentX = 0;
    this.BGCHRBank1 = null;
    this.BGCHRBank2 = null;
    this.BGCHRCurrentBank = null;
    this.tileCache = null;
    this.colors = [
        15728606,
        11392916,
        5411443,
        1586242
    ];
    this.OBJPalette = null;
    this.BGPalette = null;
    this.gbcOBJRawPalette = null;
    this.gbcBGRawPalette = null;
    this.gbOBJPalette = null;
    this.gbBGPalette = null;
    this.gbcOBJPalette = null;
    this.gbcBGPalette = null;
    this.gbBGColorizedPalette = null;
    this.gbOBJColorizedPalette = null;
    this.cachedBGPaletteConversion = null;
    this.cachedOBJPaletteConversion = null;
    this.updateGBBGPalette = this.updateGBRegularBGPalette;
    this.updateGBOBJPalette = this.updateGBRegularOBJPalette;
    this.colorizedGBPalettes = false;
    this.BGLayerRender = null;
    this.WindowLayerRender = null;
    this.SpriteLayerRender = null;
    this.frameBuffer = [];
    this.swizzledFrame = null;
    this.canvasBuffer = null;
    this.pixelStart = 0;
    this.onscreenWidth = this.offscreenWidth = 160;
    this.onscreenHeight = this.offScreenheight = 144;
    this.offscreenRGBCount = this.onscreenWidth * this.onscreenHeight * 4;
    this.intializeWhiteNoise();
}
GameBoyCore.prototype.GBBOOTROM = [];
GameBoyCore.prototype.GBCBOOTROM = [];
GameBoyCore.prototype.ffxxDump = [
    15,
    0,
    124,
    255,
    0,
    0,
    0,
    248,
    255,
    255,
    255,
    255,
    255,
    255,
    255,
    1,
    128,
    191,
    243,
    255,
    191,
    255,
    63,
    0,
    255,
    191,
    127,
    255,
    159,
    255,
    191,
    255,
    255,
    0,
    0,
    191,
    119,
    243,
    241,
    255,
    255,
    255,
    255,
    255,
    255,
    255,
    255,
    255,
    0,
    255,
    0,
    255,
    0,
    255,
    0,
    255,
    0,
    255,
    0,
    255,
    0,
    255,
    0,
    255,
    145,
    128,
    0,
    0,
    0,
    0,
    0,
    252,
    0,
    0,
    0,
    0,
    255,
    126,
    255,
    254,
    255,
    255,
    255,
    255,
    255,
    255,
    62,
    255,
    255,
    255,
    255,
    255,
    255,
    255,
    255,
    255,
    255,
    255,
    255,
    255,
    255,
    255,
    255,
    255,
    192,
    255,
    193,
    0,
    254,
    255,
    255,
    255,
    248,
    255,
    0,
    0,
    0,
    143,
    0,
    0,
    255,
    255,
    255,
    255,
    255,
    255,
    255,
    255,
    206,
    237,
    102,
    102,
    204,
    13,
    0,
    11,
    3,
    115,
    0,
    131,
    0,
    12,
    0,
    13,
    0,
    8,
    17,
    31,
    136,
    137,
    0,
    14,
    220,
    204,
    110,
    230,
    221,
    221,
    217,
    153,
    187,
    187,
    103,
    99,
    110,
    14,
    236,
    204,
    221,
    220,
    153,
    159,
    187,
    185,
    51,
    62,
    69,
    236,
    82,
    250,
    8,
    183,
    7,
    93,
    1,
    253,
    192,
    255,
    8,
    252,
    0,
    229,
    11,
    248,
    194,
    206,
    244,
    249,
    15,
    127,
    69,
    109,
    61,
    254,
    70,
    151,
    51,
    94,
    8,
    239,
    241,
    255,
    134,
    131,
    36,
    116,
    18,
    252,
    0,
    159,
    180,
    183,
    6,
    213,
    208,
    122,
    0,
    158,
    4,
    95,
    65,
    47,
    29,
    119,
    54,
    117,
    129,
    170,
    112,
    58,
    152,
    209,
    113,
    2,
    77,
    1,
    193,
    255,
    13,
    0,
    211,
    5,
    249,
    0,
    11,
    0
];
GameBoyCore.prototype.OPCODE = [
    _wrap_(function (parentObj) {
    }),
    _wrap_(function (parentObj) {
        parentObj.registerC = parentObj.memoryReader[parentObj.programCounter](parentObj, parentObj.programCounter);
        parentObj.registerB = parentObj.memoryRead(parentObj.programCounter + 1 & 65535);
        parentObj.programCounter = parentObj.programCounter + 2 & 65535;
    }),
    _wrap_(function (parentObj) {
        parentObj.memoryWrite(parentObj.registerB << 8 | parentObj.registerC, parentObj.registerA);
    }),
    _wrap_(function (parentObj) {
        var temp_var = (parentObj.registerB << 8 | parentObj.registerC) + 1;
        parentObj.registerB = temp_var >> 8 & 255;
        parentObj.registerC = temp_var & 255;
    }),
    _wrap_(function (parentObj) {
        parentObj.registerB = parentObj.registerB + 1 & 255;
        parentObj.FZero = parentObj.registerB == 0;
        parentObj.FHalfCarry = (parentObj.registerB & 15) == 0;
        parentObj.FSubtract = false;
    }),
    _wrap_(function (parentObj) {
        parentObj.registerB = parentObj.registerB - 1 & 255;
        parentObj.FZero = parentObj.registerB == 0;
        parentObj.FHalfCarry = (parentObj.registerB & 15) == 15;
        parentObj.FSubtract = true;
    }),
    _wrap_(function (parentObj) {
        parentObj.registerB = parentObj.memoryReader[parentObj.programCounter](parentObj, parentObj.programCounter);
        parentObj.programCounter = parentObj.programCounter + 1 & 65535;
    }),
    _wrap_(function (parentObj) {
        parentObj.FCarry = parentObj.registerA > 127;
        parentObj.registerA = parentObj.registerA << 1 & 255 | parentObj.registerA >> 7;
        parentObj.FZero = parentObj.FSubtract = parentObj.FHalfCarry = false;
    }),
    _wrap_(function (parentObj) {
        var temp_var = parentObj.memoryRead(parentObj.programCounter + 1 & 65535) << 8 | parentObj.memoryReader[parentObj.programCounter](parentObj, parentObj.programCounter);
        parentObj.programCounter = parentObj.programCounter + 2 & 65535;
        parentObj.memoryWrite(temp_var, parentObj.stackPointer & 255);
        parentObj.memoryWrite(temp_var + 1 & 65535, parentObj.stackPointer >> 8);
    }),
    _wrap_(function (parentObj) {
        var dirtySum = parentObj.registersHL + (parentObj.registerB << 8 | parentObj.registerC);
        parentObj.FHalfCarry = (parentObj.registersHL & 4095) > (dirtySum & 4095);
        parentObj.FCarry = dirtySum > 65535;
        parentObj.registersHL = dirtySum & 65535;
        parentObj.FSubtract = false;
    }),
    _wrap_(function (parentObj) {
        parentObj.registerA = parentObj.memoryRead(parentObj.registerB << 8 | parentObj.registerC);
    }),
    _wrap_(function (parentObj) {
        var temp_var = (parentObj.registerB << 8 | parentObj.registerC) - 1 & 65535;
        parentObj.registerB = temp_var >> 8;
        parentObj.registerC = temp_var & 255;
    }),
    _wrap_(function (parentObj) {
        parentObj.registerC = parentObj.registerC + 1 & 255;
        parentObj.FZero = parentObj.registerC == 0;
        parentObj.FHalfCarry = (parentObj.registerC & 15) == 0;
        parentObj.FSubtract = false;
    }),
    _wrap_(function (parentObj) {
        parentObj.registerC = parentObj.registerC - 1 & 255;
        parentObj.FZero = parentObj.registerC == 0;
        parentObj.FHalfCarry = (parentObj.registerC & 15) == 15;
        parentObj.FSubtract = true;
    }),
    _wrap_(function (parentObj) {
        parentObj.registerC = parentObj.memoryReader[parentObj.programCounter](parentObj, parentObj.programCounter);
        parentObj.programCounter = parentObj.programCounter + 1 & 65535;
    }),
    _wrap_(function (parentObj) {
        parentObj.registerA = parentObj.registerA >> 1 | (parentObj.registerA & 1) << 7;
        parentObj.FCarry = parentObj.registerA > 127;
        parentObj.FZero = parentObj.FSubtract = parentObj.FHalfCarry = false;
    }),
    _wrap_(function (parentObj) {
        if (parentObj.cGBC) {
            if ((parentObj.memory[65357] & 1) == 1) {
                if (parentObj.memory[65357] > 127) {
                    cout('Going into single clock speed mode.', 0);
                    parentObj.doubleSpeedShifter = 0;
                    parentObj.memory[65357] &= 127;
                } else {
                    cout('Going into double clock speed mode.', 0);
                    parentObj.doubleSpeedShifter = 1;
                    parentObj.memory[65357] |= 128;
                }
                parentObj.memory[65357] &= 254;
            } else {
                parentObj.handleSTOP();
            }
        } else {
            parentObj.handleSTOP();
        }
    }),
    _wrap_(function (parentObj) {
        parentObj.registerE = parentObj.memoryReader[parentObj.programCounter](parentObj, parentObj.programCounter);
        parentObj.registerD = parentObj.memoryRead(parentObj.programCounter + 1 & 65535);
        parentObj.programCounter = parentObj.programCounter + 2 & 65535;
    }),
    _wrap_(function (parentObj) {
        parentObj.memoryWrite(parentObj.registerD << 8 | parentObj.registerE, parentObj.registerA);
    }),
    _wrap_(function (parentObj) {
        var temp_var = (parentObj.registerD << 8 | parentObj.registerE) + 1;
        parentObj.registerD = temp_var >> 8 & 255;
        parentObj.registerE = temp_var & 255;
    }),
    _wrap_(function (parentObj) {
        parentObj.registerD = parentObj.registerD + 1 & 255;
        parentObj.FZero = parentObj.registerD == 0;
        parentObj.FHalfCarry = (parentObj.registerD & 15) == 0;
        parentObj.FSubtract = false;
    }),
    _wrap_(function (parentObj) {
        parentObj.registerD = parentObj.registerD - 1 & 255;
        parentObj.FZero = parentObj.registerD == 0;
        parentObj.FHalfCarry = (parentObj.registerD & 15) == 15;
        parentObj.FSubtract = true;
    }),
    _wrap_(function (parentObj) {
        parentObj.registerD = parentObj.memoryReader[parentObj.programCounter](parentObj, parentObj.programCounter);
        parentObj.programCounter = parentObj.programCounter + 1 & 65535;
    }),
    _wrap_(function (parentObj) {
        var carry_flag = parentObj.FCarry ? 1 : 0;
        parentObj.FCarry = parentObj.registerA > 127;
        parentObj.registerA = parentObj.registerA << 1 & 255 | carry_flag;
        parentObj.FZero = parentObj.FSubtract = parentObj.FHalfCarry = false;
    }),
    _wrap_(function (parentObj) {
        parentObj.programCounter = parentObj.programCounter + (parentObj.memoryReader[parentObj.programCounter](parentObj, parentObj.programCounter) << 24 >> 24) + 1 & 65535;
    }),
    _wrap_(function (parentObj) {
        var dirtySum = parentObj.registersHL + (parentObj.registerD << 8 | parentObj.registerE);
        parentObj.FHalfCarry = (parentObj.registersHL & 4095) > (dirtySum & 4095);
        parentObj.FCarry = dirtySum > 65535;
        parentObj.registersHL = dirtySum & 65535;
        parentObj.FSubtract = false;
    }),
    _wrap_(function (parentObj) {
        parentObj.registerA = parentObj.memoryRead(parentObj.registerD << 8 | parentObj.registerE);
    }),
    _wrap_(function (parentObj) {
        var temp_var = (parentObj.registerD << 8 | parentObj.registerE) - 1 & 65535;
        parentObj.registerD = temp_var >> 8;
        parentObj.registerE = temp_var & 255;
    }),
    _wrap_(function (parentObj) {
        parentObj.registerE = parentObj.registerE + 1 & 255;
        parentObj.FZero = parentObj.registerE == 0;
        parentObj.FHalfCarry = (parentObj.registerE & 15) == 0;
        parentObj.FSubtract = false;
    }),
    _wrap_(function (parentObj) {
        parentObj.registerE = parentObj.registerE - 1 & 255;
        parentObj.FZero = parentObj.registerE == 0;
        parentObj.FHalfCarry = (parentObj.registerE & 15) == 15;
        parentObj.FSubtract = true;
    }),
    _wrap_(function (parentObj) {
        parentObj.registerE = parentObj.memoryReader[parentObj.programCounter](parentObj, parentObj.programCounter);
        parentObj.programCounter = parentObj.programCounter + 1 & 65535;
    }),
    _wrap_(function (parentObj) {
        var carry_flag = parentObj.FCarry ? 128 : 0;
        parentObj.FCarry = (parentObj.registerA & 1) == 1;
        parentObj.registerA = parentObj.registerA >> 1 | carry_flag;
        parentObj.FZero = parentObj.FSubtract = parentObj.FHalfCarry = false;
    }),
    _wrap_(function (parentObj) {
        if (!parentObj.FZero) {
            parentObj.programCounter = parentObj.programCounter + (parentObj.memoryReader[parentObj.programCounter](parentObj, parentObj.programCounter) << 24 >> 24) + 1 & 65535;
            parentObj.CPUTicks += 4;
        } else {
            parentObj.programCounter = parentObj.programCounter + 1 & 65535;
        }
    }),
    _wrap_(function (parentObj) {
        parentObj.registersHL = parentObj.memoryRead(parentObj.programCounter + 1 & 65535) << 8 | parentObj.memoryReader[parentObj.programCounter](parentObj, parentObj.programCounter);
        parentObj.programCounter = parentObj.programCounter + 2 & 65535;
    }),
    _wrap_(function (parentObj) {
        parentObj.memoryWriter[parentObj.registersHL](parentObj, parentObj.registersHL, parentObj.registerA);
        parentObj.registersHL = parentObj.registersHL + 1 & 65535;
    }),
    _wrap_(function (parentObj) {
        parentObj.registersHL = parentObj.registersHL + 1 & 65535;
    }),
    _wrap_(function (parentObj) {
        var H = (parentObj.registersHL >> 8) + 1 & 255;
        parentObj.FZero = H == 0;
        parentObj.FHalfCarry = (H & 15) == 0;
        parentObj.FSubtract = false;
        parentObj.registersHL = H << 8 | parentObj.registersHL & 255;
    }),
    _wrap_(function (parentObj) {
        var H = (parentObj.registersHL >> 8) - 1 & 255;
        parentObj.FZero = H == 0;
        parentObj.FHalfCarry = (H & 15) == 15;
        parentObj.FSubtract = true;
        parentObj.registersHL = H << 8 | parentObj.registersHL & 255;
    }),
    _wrap_(function (parentObj) {
        parentObj.registersHL = parentObj.memoryReader[parentObj.programCounter](parentObj, parentObj.programCounter) << 8 | parentObj.registersHL & 255;
        parentObj.programCounter = parentObj.programCounter + 1 & 65535;
    }),
    _wrap_(function (parentObj) {
        if (!parentObj.FSubtract) {
            if (parentObj.FCarry || parentObj.registerA > 153) {
                parentObj.registerA = parentObj.registerA + 96 & 255;
                parentObj.FCarry = true;
            }
            if (parentObj.FHalfCarry || (parentObj.registerA & 15) > 9) {
                parentObj.registerA = parentObj.registerA + 6 & 255;
                parentObj.FHalfCarry = false;
            }
        } else if (parentObj.FCarry && parentObj.FHalfCarry) {
            parentObj.registerA = parentObj.registerA + 154 & 255;
            parentObj.FHalfCarry = false;
        } else if (parentObj.FCarry) {
            parentObj.registerA = parentObj.registerA + 160 & 255;
        } else if (parentObj.FHalfCarry) {
            parentObj.registerA = parentObj.registerA + 250 & 255;
            parentObj.FHalfCarry = false;
        }
        parentObj.FZero = parentObj.registerA == 0;
    }),
    _wrap_(function (parentObj) {
        if (parentObj.FZero) {
            parentObj.programCounter = parentObj.programCounter + (parentObj.memoryReader[parentObj.programCounter](parentObj, parentObj.programCounter) << 24 >> 24) + 1 & 65535;
            parentObj.CPUTicks += 4;
        } else {
            parentObj.programCounter = parentObj.programCounter + 1 & 65535;
        }
    }),
    _wrap_(function (parentObj) {
        parentObj.FHalfCarry = (parentObj.registersHL & 4095) > 2047;
        parentObj.FCarry = parentObj.registersHL > 32767;
        parentObj.registersHL = parentObj.registersHL << 1 & 65535;
        parentObj.FSubtract = false;
    }),
    _wrap_(function (parentObj) {
        parentObj.registerA = parentObj.memoryReader[parentObj.registersHL](parentObj, parentObj.registersHL);
        parentObj.registersHL = parentObj.registersHL + 1 & 65535;
    }),
    _wrap_(function (parentObj) {
        parentObj.registersHL = parentObj.registersHL - 1 & 65535;
    }),
    _wrap_(function (parentObj) {
        var L = parentObj.registersHL + 1 & 255;
        parentObj.FZero = L == 0;
        parentObj.FHalfCarry = (L & 15) == 0;
        parentObj.FSubtract = false;
        parentObj.registersHL = parentObj.registersHL & 65280 | L;
    }),
    _wrap_(function (parentObj) {
        var L = parentObj.registersHL - 1 & 255;
        parentObj.FZero = L == 0;
        parentObj.FHalfCarry = (L & 15) == 15;
        parentObj.FSubtract = true;
        parentObj.registersHL = parentObj.registersHL & 65280 | L;
    }),
    _wrap_(function (parentObj) {
        parentObj.registersHL = parentObj.registersHL & 65280 | parentObj.memoryReader[parentObj.programCounter](parentObj, parentObj.programCounter);
        parentObj.programCounter = parentObj.programCounter + 1 & 65535;
    }),
    _wrap_(function (parentObj) {
        parentObj.registerA ^= 255;
        parentObj.FSubtract = parentObj.FHalfCarry = true;
    }),
    _wrap_(function (parentObj) {
        if (!parentObj.FCarry) {
            parentObj.programCounter = parentObj.programCounter + (parentObj.memoryReader[parentObj.programCounter](parentObj, parentObj.programCounter) << 24 >> 24) + 1 & 65535;
            parentObj.CPUTicks += 4;
        } else {
            parentObj.programCounter = parentObj.programCounter + 1 & 65535;
        }
    }),
    _wrap_(function (parentObj) {
        parentObj.stackPointer = parentObj.memoryRead(parentObj.programCounter + 1 & 65535) << 8 | parentObj.memoryReader[parentObj.programCounter](parentObj, parentObj.programCounter);
        parentObj.programCounter = parentObj.programCounter + 2 & 65535;
    }),
    _wrap_(function (parentObj) {
        parentObj.memoryWriter[parentObj.registersHL](parentObj, parentObj.registersHL, parentObj.registerA);
        parentObj.registersHL = parentObj.registersHL - 1 & 65535;
    }),
    _wrap_(function (parentObj) {
        parentObj.stackPointer = parentObj.stackPointer + 1 & 65535;
    }),
    _wrap_(function (parentObj) {
        var temp_var = parentObj.memoryReader[parentObj.registersHL](parentObj, parentObj.registersHL) + 1 & 255;
        parentObj.FZero = temp_var == 0;
        parentObj.FHalfCarry = (temp_var & 15) == 0;
        parentObj.FSubtract = false;
        parentObj.memoryWriter[parentObj.registersHL](parentObj, parentObj.registersHL, temp_var);
    }),
    _wrap_(function (parentObj) {
        var temp_var = parentObj.memoryReader[parentObj.registersHL](parentObj, parentObj.registersHL) - 1 & 255;
        parentObj.FZero = temp_var == 0;
        parentObj.FHalfCarry = (temp_var & 15) == 15;
        parentObj.FSubtract = true;
        parentObj.memoryWriter[parentObj.registersHL](parentObj, parentObj.registersHL, temp_var);
    }),
    _wrap_(function (parentObj) {
        parentObj.memoryWriter[parentObj.registersHL](parentObj, parentObj.registersHL, parentObj.memoryReader[parentObj.programCounter](parentObj, parentObj.programCounter));
        parentObj.programCounter = parentObj.programCounter + 1 & 65535;
    }),
    _wrap_(function (parentObj) {
        parentObj.FCarry = true;
        parentObj.FSubtract = parentObj.FHalfCarry = false;
    }),
    _wrap_(function (parentObj) {
        if (parentObj.FCarry) {
            parentObj.programCounter = parentObj.programCounter + (parentObj.memoryReader[parentObj.programCounter](parentObj, parentObj.programCounter) << 24 >> 24) + 1 & 65535;
            parentObj.CPUTicks += 4;
        } else {
            parentObj.programCounter = parentObj.programCounter + 1 & 65535;
        }
    }),
    _wrap_(function (parentObj) {
        var dirtySum = parentObj.registersHL + parentObj.stackPointer;
        parentObj.FHalfCarry = (parentObj.registersHL & 4095) > (dirtySum & 4095);
        parentObj.FCarry = dirtySum > 65535;
        parentObj.registersHL = dirtySum & 65535;
        parentObj.FSubtract = false;
    }),
    _wrap_(function (parentObj) {
        parentObj.registerA = parentObj.memoryReader[parentObj.registersHL](parentObj, parentObj.registersHL);
        parentObj.registersHL = parentObj.registersHL - 1 & 65535;
    }),
    _wrap_(function (parentObj) {
        parentObj.stackPointer = parentObj.stackPointer - 1 & 65535;
    }),
    _wrap_(function (parentObj) {
        parentObj.registerA = parentObj.registerA + 1 & 255;
        parentObj.FZero = parentObj.registerA == 0;
        parentObj.FHalfCarry = (parentObj.registerA & 15) == 0;
        parentObj.FSubtract = false;
    }),
    _wrap_(function (parentObj) {
        parentObj.registerA = parentObj.registerA - 1 & 255;
        parentObj.FZero = parentObj.registerA == 0;
        parentObj.FHalfCarry = (parentObj.registerA & 15) == 15;
        parentObj.FSubtract = true;
    }),
    _wrap_(function (parentObj) {
        parentObj.registerA = parentObj.memoryReader[parentObj.programCounter](parentObj, parentObj.programCounter);
        parentObj.programCounter = parentObj.programCounter + 1 & 65535;
    }),
    _wrap_(function (parentObj) {
        parentObj.FCarry = !parentObj.FCarry;
        parentObj.FSubtract = parentObj.FHalfCarry = false;
    }),
    _wrap_(function (parentObj) {
    }),
    _wrap_(function (parentObj) {
        parentObj.registerB = parentObj.registerC;
    }),
    _wrap_(function (parentObj) {
        parentObj.registerB = parentObj.registerD;
    }),
    _wrap_(function (parentObj) {
        parentObj.registerB = parentObj.registerE;
    }),
    _wrap_(function (parentObj) {
        parentObj.registerB = parentObj.registersHL >> 8;
    }),
    _wrap_(function (parentObj) {
        parentObj.registerB = parentObj.registersHL & 255;
    }),
    _wrap_(function (parentObj) {
        parentObj.registerB = parentObj.memoryReader[parentObj.registersHL](parentObj, parentObj.registersHL);
    }),
    _wrap_(function (parentObj) {
        parentObj.registerB = parentObj.registerA;
    }),
    _wrap_(function (parentObj) {
        parentObj.registerC = parentObj.registerB;
    }),
    _wrap_(function (parentObj) {
    }),
    _wrap_(function (parentObj) {
        parentObj.registerC = parentObj.registerD;
    }),
    _wrap_(function (parentObj) {
        parentObj.registerC = parentObj.registerE;
    }),
    _wrap_(function (parentObj) {
        parentObj.registerC = parentObj.registersHL >> 8;
    }),
    _wrap_(function (parentObj) {
        parentObj.registerC = parentObj.registersHL & 255;
    }),
    _wrap_(function (parentObj) {
        parentObj.registerC = parentObj.memoryReader[parentObj.registersHL](parentObj, parentObj.registersHL);
    }),
    _wrap_(function (parentObj) {
        parentObj.registerC = parentObj.registerA;
    }),
    _wrap_(function (parentObj) {
        parentObj.registerD = parentObj.registerB;
    }),
    _wrap_(function (parentObj) {
        parentObj.registerD = parentObj.registerC;
    }),
    _wrap_(function (parentObj) {
    }),
    _wrap_(function (parentObj) {
        parentObj.registerD = parentObj.registerE;
    }),
    _wrap_(function (parentObj) {
        parentObj.registerD = parentObj.registersHL >> 8;
    }),
    _wrap_(function (parentObj) {
        parentObj.registerD = parentObj.registersHL & 255;
    }),
    _wrap_(function (parentObj) {
        parentObj.registerD = parentObj.memoryReader[parentObj.registersHL](parentObj, parentObj.registersHL);
    }),
    _wrap_(function (parentObj) {
        parentObj.registerD = parentObj.registerA;
    }),
    _wrap_(function (parentObj) {
        parentObj.registerE = parentObj.registerB;
    }),
    _wrap_(function (parentObj) {
        parentObj.registerE = parentObj.registerC;
    }),
    _wrap_(function (parentObj) {
        parentObj.registerE = parentObj.registerD;
    }),
    _wrap_(function (parentObj) {
    }),
    _wrap_(function (parentObj) {
        parentObj.registerE = parentObj.registersHL >> 8;
    }),
    _wrap_(function (parentObj) {
        parentObj.registerE = parentObj.registersHL & 255;
    }),
    _wrap_(function (parentObj) {
        parentObj.registerE = parentObj.memoryReader[parentObj.registersHL](parentObj, parentObj.registersHL);
    }),
    _wrap_(function (parentObj) {
        parentObj.registerE = parentObj.registerA;
    }),
    _wrap_(function (parentObj) {
        parentObj.registersHL = parentObj.registerB << 8 | parentObj.registersHL & 255;
    }),
    _wrap_(function (parentObj) {
        parentObj.registersHL = parentObj.registerC << 8 | parentObj.registersHL & 255;
    }),
    _wrap_(function (parentObj) {
        parentObj.registersHL = parentObj.registerD << 8 | parentObj.registersHL & 255;
    }),
    _wrap_(function (parentObj) {
        parentObj.registersHL = parentObj.registerE << 8 | parentObj.registersHL & 255;
    }),
    _wrap_(function (parentObj) {
    }),
    _wrap_(function (parentObj) {
        parentObj.registersHL = (parentObj.registersHL & 255) * 257;
    }),
    _wrap_(function (parentObj) {
        parentObj.registersHL = parentObj.memoryReader[parentObj.registersHL](parentObj, parentObj.registersHL) << 8 | parentObj.registersHL & 255;
    }),
    _wrap_(function (parentObj) {
        parentObj.registersHL = parentObj.registerA << 8 | parentObj.registersHL & 255;
    }),
    _wrap_(function (parentObj) {
        parentObj.registersHL = parentObj.registersHL & 65280 | parentObj.registerB;
    }),
    _wrap_(function (parentObj) {
        parentObj.registersHL = parentObj.registersHL & 65280 | parentObj.registerC;
    }),
    _wrap_(function (parentObj) {
        parentObj.registersHL = parentObj.registersHL & 65280 | parentObj.registerD;
    }),
    _wrap_(function (parentObj) {
        parentObj.registersHL = parentObj.registersHL & 65280 | parentObj.registerE;
    }),
    _wrap_(function (parentObj) {
        parentObj.registersHL = parentObj.registersHL & 65280 | parentObj.registersHL >> 8;
    }),
    _wrap_(function (parentObj) {
    }),
    _wrap_(function (parentObj) {
        parentObj.registersHL = parentObj.registersHL & 65280 | parentObj.memoryReader[parentObj.registersHL](parentObj, parentObj.registersHL);
    }),
    _wrap_(function (parentObj) {
        parentObj.registersHL = parentObj.registersHL & 65280 | parentObj.registerA;
    }),
    _wrap_(function (parentObj) {
        parentObj.memoryWriter[parentObj.registersHL](parentObj, parentObj.registersHL, parentObj.registerB);
    }),
    _wrap_(function (parentObj) {
        parentObj.memoryWriter[parentObj.registersHL](parentObj, parentObj.registersHL, parentObj.registerC);
    }),
    _wrap_(function (parentObj) {
        parentObj.memoryWriter[parentObj.registersHL](parentObj, parentObj.registersHL, parentObj.registerD);
    }),
    _wrap_(function (parentObj) {
        parentObj.memoryWriter[parentObj.registersHL](parentObj, parentObj.registersHL, parentObj.registerE);
    }),
    _wrap_(function (parentObj) {
        parentObj.memoryWriter[parentObj.registersHL](parentObj, parentObj.registersHL, parentObj.registersHL >> 8);
    }),
    _wrap_(function (parentObj) {
        parentObj.memoryWriter[parentObj.registersHL](parentObj, parentObj.registersHL, parentObj.registersHL & 255);
    }),
    _wrap_(function (parentObj) {
        if ((parentObj.interruptsEnabled & parentObj.interruptsRequested & 31) > 0) {
            if (!parentObj.cGBC && !parentObj.usedBootROM) {
                parentObj.skipPCIncrement = true;
            } else {
                parentObj.CPUTicks += 4;
            }
        } else {
            parentObj.calculateHALTPeriod();
        }
    }),
    _wrap_(function (parentObj) {
        parentObj.memoryWriter[parentObj.registersHL](parentObj, parentObj.registersHL, parentObj.registerA);
    }),
    _wrap_(function (parentObj) {
        parentObj.registerA = parentObj.registerB;
    }),
    _wrap_(function (parentObj) {
        parentObj.registerA = parentObj.registerC;
    }),
    _wrap_(function (parentObj) {
        parentObj.registerA = parentObj.registerD;
    }),
    _wrap_(function (parentObj) {
        parentObj.registerA = parentObj.registerE;
    }),
    _wrap_(function (parentObj) {
        parentObj.registerA = parentObj.registersHL >> 8;
    }),
    _wrap_(function (parentObj) {
        parentObj.registerA = parentObj.registersHL & 255;
    }),
    _wrap_(function (parentObj) {
        parentObj.registerA = parentObj.memoryReader[parentObj.registersHL](parentObj, parentObj.registersHL);
    }),
    _wrap_(function (parentObj) {
    }),
    _wrap_(function (parentObj) {
        var dirtySum = parentObj.registerA + parentObj.registerB;
        parentObj.FHalfCarry = (dirtySum & 15) < (parentObj.registerA & 15);
        parentObj.FCarry = dirtySum > 255;
        parentObj.registerA = dirtySum & 255;
        parentObj.FZero = parentObj.registerA == 0;
        parentObj.FSubtract = false;
    }),
    _wrap_(function (parentObj) {
        var dirtySum = parentObj.registerA + parentObj.registerC;
        parentObj.FHalfCarry = (dirtySum & 15) < (parentObj.registerA & 15);
        parentObj.FCarry = dirtySum > 255;
        parentObj.registerA = dirtySum & 255;
        parentObj.FZero = parentObj.registerA == 0;
        parentObj.FSubtract = false;
    }),
    _wrap_(function (parentObj) {
        var dirtySum = parentObj.registerA + parentObj.registerD;
        parentObj.FHalfCarry = (dirtySum & 15) < (parentObj.registerA & 15);
        parentObj.FCarry = dirtySum > 255;
        parentObj.registerA = dirtySum & 255;
        parentObj.FZero = parentObj.registerA == 0;
        parentObj.FSubtract = false;
    }),
    _wrap_(function (parentObj) {
        var dirtySum = parentObj.registerA + parentObj.registerE;
        parentObj.FHalfCarry = (dirtySum & 15) < (parentObj.registerA & 15);
        parentObj.FCarry = dirtySum > 255;
        parentObj.registerA = dirtySum & 255;
        parentObj.FZero = parentObj.registerA == 0;
        parentObj.FSubtract = false;
    }),
    _wrap_(function (parentObj) {
        var dirtySum = parentObj.registerA + (parentObj.registersHL >> 8);
        parentObj.FHalfCarry = (dirtySum & 15) < (parentObj.registerA & 15);
        parentObj.FCarry = dirtySum > 255;
        parentObj.registerA = dirtySum & 255;
        parentObj.FZero = parentObj.registerA == 0;
        parentObj.FSubtract = false;
    }),
    _wrap_(function (parentObj) {
        var dirtySum = parentObj.registerA + (parentObj.registersHL & 255);
        parentObj.FHalfCarry = (dirtySum & 15) < (parentObj.registerA & 15);
        parentObj.FCarry = dirtySum > 255;
        parentObj.registerA = dirtySum & 255;
        parentObj.FZero = parentObj.registerA == 0;
        parentObj.FSubtract = false;
    }),
    _wrap_(function (parentObj) {
        var dirtySum = parentObj.registerA + parentObj.memoryReader[parentObj.registersHL](parentObj, parentObj.registersHL);
        parentObj.FHalfCarry = (dirtySum & 15) < (parentObj.registerA & 15);
        parentObj.FCarry = dirtySum > 255;
        parentObj.registerA = dirtySum & 255;
        parentObj.FZero = parentObj.registerA == 0;
        parentObj.FSubtract = false;
    }),
    _wrap_(function (parentObj) {
        parentObj.FHalfCarry = (parentObj.registerA & 8) == 8;
        parentObj.FCarry = parentObj.registerA > 127;
        parentObj.registerA = parentObj.registerA << 1 & 255;
        parentObj.FZero = parentObj.registerA == 0;
        parentObj.FSubtract = false;
    }),
    _wrap_(function (parentObj) {
        var dirtySum = parentObj.registerA + parentObj.registerB + (parentObj.FCarry ? 1 : 0);
        parentObj.FHalfCarry = (parentObj.registerA & 15) + (parentObj.registerB & 15) + (parentObj.FCarry ? 1 : 0) > 15;
        parentObj.FCarry = dirtySum > 255;
        parentObj.registerA = dirtySum & 255;
        parentObj.FZero = parentObj.registerA == 0;
        parentObj.FSubtract = false;
    }),
    _wrap_(function (parentObj) {
        var dirtySum = parentObj.registerA + parentObj.registerC + (parentObj.FCarry ? 1 : 0);
        parentObj.FHalfCarry = (parentObj.registerA & 15) + (parentObj.registerC & 15) + (parentObj.FCarry ? 1 : 0) > 15;
        parentObj.FCarry = dirtySum > 255;
        parentObj.registerA = dirtySum & 255;
        parentObj.FZero = parentObj.registerA == 0;
        parentObj.FSubtract = false;
    }),
    _wrap_(function (parentObj) {
        var dirtySum = parentObj.registerA + parentObj.registerD + (parentObj.FCarry ? 1 : 0);
        parentObj.FHalfCarry = (parentObj.registerA & 15) + (parentObj.registerD & 15) + (parentObj.FCarry ? 1 : 0) > 15;
        parentObj.FCarry = dirtySum > 255;
        parentObj.registerA = dirtySum & 255;
        parentObj.FZero = parentObj.registerA == 0;
        parentObj.FSubtract = false;
    }),
    _wrap_(function (parentObj) {
        var dirtySum = parentObj.registerA + parentObj.registerE + (parentObj.FCarry ? 1 : 0);
        parentObj.FHalfCarry = (parentObj.registerA & 15) + (parentObj.registerE & 15) + (parentObj.FCarry ? 1 : 0) > 15;
        parentObj.FCarry = dirtySum > 255;
        parentObj.registerA = dirtySum & 255;
        parentObj.FZero = parentObj.registerA == 0;
        parentObj.FSubtract = false;
    }),
    _wrap_(function (parentObj) {
        var tempValue = parentObj.registersHL >> 8;
        var dirtySum = parentObj.registerA + tempValue + (parentObj.FCarry ? 1 : 0);
        parentObj.FHalfCarry = (parentObj.registerA & 15) + (tempValue & 15) + (parentObj.FCarry ? 1 : 0) > 15;
        parentObj.FCarry = dirtySum > 255;
        parentObj.registerA = dirtySum & 255;
        parentObj.FZero = parentObj.registerA == 0;
        parentObj.FSubtract = false;
    }),
    _wrap_(function (parentObj) {
        var tempValue = parentObj.registersHL & 255;
        var dirtySum = parentObj.registerA + tempValue + (parentObj.FCarry ? 1 : 0);
        parentObj.FHalfCarry = (parentObj.registerA & 15) + (tempValue & 15) + (parentObj.FCarry ? 1 : 0) > 15;
        parentObj.FCarry = dirtySum > 255;
        parentObj.registerA = dirtySum & 255;
        parentObj.FZero = parentObj.registerA == 0;
        parentObj.FSubtract = false;
    }),
    _wrap_(function (parentObj) {
        var tempValue = parentObj.memoryReader[parentObj.registersHL](parentObj, parentObj.registersHL);
        var dirtySum = parentObj.registerA + tempValue + (parentObj.FCarry ? 1 : 0);
        parentObj.FHalfCarry = (parentObj.registerA & 15) + (tempValue & 15) + (parentObj.FCarry ? 1 : 0) > 15;
        parentObj.FCarry = dirtySum > 255;
        parentObj.registerA = dirtySum & 255;
        parentObj.FZero = parentObj.registerA == 0;
        parentObj.FSubtract = false;
    }),
    _wrap_(function (parentObj) {
        var dirtySum = parentObj.registerA << 1 | (parentObj.FCarry ? 1 : 0);
        parentObj.FHalfCarry = (parentObj.registerA << 1 & 30 | (parentObj.FCarry ? 1 : 0)) > 15;
        parentObj.FCarry = dirtySum > 255;
        parentObj.registerA = dirtySum & 255;
        parentObj.FZero = parentObj.registerA == 0;
        parentObj.FSubtract = false;
    }),
    _wrap_(function (parentObj) {
        var dirtySum = parentObj.registerA - parentObj.registerB;
        parentObj.FHalfCarry = (parentObj.registerA & 15) < (dirtySum & 15);
        parentObj.FCarry = dirtySum < 0;
        parentObj.registerA = dirtySum & 255;
        parentObj.FZero = dirtySum == 0;
        parentObj.FSubtract = true;
    }),
    _wrap_(function (parentObj) {
        var dirtySum = parentObj.registerA - parentObj.registerC;
        parentObj.FHalfCarry = (parentObj.registerA & 15) < (dirtySum & 15);
        parentObj.FCarry = dirtySum < 0;
        parentObj.registerA = dirtySum & 255;
        parentObj.FZero = dirtySum == 0;
        parentObj.FSubtract = true;
    }),
    _wrap_(function (parentObj) {
        var dirtySum = parentObj.registerA - parentObj.registerD;
        parentObj.FHalfCarry = (parentObj.registerA & 15) < (dirtySum & 15);
        parentObj.FCarry = dirtySum < 0;
        parentObj.registerA = dirtySum & 255;
        parentObj.FZero = dirtySum == 0;
        parentObj.FSubtract = true;
    }),
    _wrap_(function (parentObj) {
        var dirtySum = parentObj.registerA - parentObj.registerE;
        parentObj.FHalfCarry = (parentObj.registerA & 15) < (dirtySum & 15);
        parentObj.FCarry = dirtySum < 0;
        parentObj.registerA = dirtySum & 255;
        parentObj.FZero = dirtySum == 0;
        parentObj.FSubtract = true;
    }),
    _wrap_(function (parentObj) {
        var dirtySum = parentObj.registerA - (parentObj.registersHL >> 8);
        parentObj.FHalfCarry = (parentObj.registerA & 15) < (dirtySum & 15);
        parentObj.FCarry = dirtySum < 0;
        parentObj.registerA = dirtySum & 255;
        parentObj.FZero = dirtySum == 0;
        parentObj.FSubtract = true;
    }),
    _wrap_(function (parentObj) {
        var dirtySum = parentObj.registerA - (parentObj.registersHL & 255);
        parentObj.FHalfCarry = (parentObj.registerA & 15) < (dirtySum & 15);
        parentObj.FCarry = dirtySum < 0;
        parentObj.registerA = dirtySum & 255;
        parentObj.FZero = dirtySum == 0;
        parentObj.FSubtract = true;
    }),
    _wrap_(function (parentObj) {
        var dirtySum = parentObj.registerA - parentObj.memoryReader[parentObj.registersHL](parentObj, parentObj.registersHL);
        parentObj.FHalfCarry = (parentObj.registerA & 15) < (dirtySum & 15);
        parentObj.FCarry = dirtySum < 0;
        parentObj.registerA = dirtySum & 255;
        parentObj.FZero = dirtySum == 0;
        parentObj.FSubtract = true;
    }),
    _wrap_(function (parentObj) {
        parentObj.registerA = 0;
        parentObj.FHalfCarry = parentObj.FCarry = false;
        parentObj.FZero = parentObj.FSubtract = true;
    }),
    _wrap_(function (parentObj) {
        var dirtySum = parentObj.registerA - parentObj.registerB - (parentObj.FCarry ? 1 : 0);
        parentObj.FHalfCarry = (parentObj.registerA & 15) - (parentObj.registerB & 15) - (parentObj.FCarry ? 1 : 0) < 0;
        parentObj.FCarry = dirtySum < 0;
        parentObj.registerA = dirtySum & 255;
        parentObj.FZero = parentObj.registerA == 0;
        parentObj.FSubtract = true;
    }),
    _wrap_(function (parentObj) {
        var dirtySum = parentObj.registerA - parentObj.registerC - (parentObj.FCarry ? 1 : 0);
        parentObj.FHalfCarry = (parentObj.registerA & 15) - (parentObj.registerC & 15) - (parentObj.FCarry ? 1 : 0) < 0;
        parentObj.FCarry = dirtySum < 0;
        parentObj.registerA = dirtySum & 255;
        parentObj.FZero = parentObj.registerA == 0;
        parentObj.FSubtract = true;
    }),
    _wrap_(function (parentObj) {
        var dirtySum = parentObj.registerA - parentObj.registerD - (parentObj.FCarry ? 1 : 0);
        parentObj.FHalfCarry = (parentObj.registerA & 15) - (parentObj.registerD & 15) - (parentObj.FCarry ? 1 : 0) < 0;
        parentObj.FCarry = dirtySum < 0;
        parentObj.registerA = dirtySum & 255;
        parentObj.FZero = parentObj.registerA == 0;
        parentObj.FSubtract = true;
    }),
    _wrap_(function (parentObj) {
        var dirtySum = parentObj.registerA - parentObj.registerE - (parentObj.FCarry ? 1 : 0);
        parentObj.FHalfCarry = (parentObj.registerA & 15) - (parentObj.registerE & 15) - (parentObj.FCarry ? 1 : 0) < 0;
        parentObj.FCarry = dirtySum < 0;
        parentObj.registerA = dirtySum & 255;
        parentObj.FZero = parentObj.registerA == 0;
        parentObj.FSubtract = true;
    }),
    _wrap_(function (parentObj) {
        var temp_var = parentObj.registersHL >> 8;
        var dirtySum = parentObj.registerA - temp_var - (parentObj.FCarry ? 1 : 0);
        parentObj.FHalfCarry = (parentObj.registerA & 15) - (temp_var & 15) - (parentObj.FCarry ? 1 : 0) < 0;
        parentObj.FCarry = dirtySum < 0;
        parentObj.registerA = dirtySum & 255;
        parentObj.FZero = parentObj.registerA == 0;
        parentObj.FSubtract = true;
    }),
    _wrap_(function (parentObj) {
        var dirtySum = parentObj.registerA - (parentObj.registersHL & 255) - (parentObj.FCarry ? 1 : 0);
        parentObj.FHalfCarry = (parentObj.registerA & 15) - (parentObj.registersHL & 15) - (parentObj.FCarry ? 1 : 0) < 0;
        parentObj.FCarry = dirtySum < 0;
        parentObj.registerA = dirtySum & 255;
        parentObj.FZero = parentObj.registerA == 0;
        parentObj.FSubtract = true;
    }),
    _wrap_(function (parentObj) {
        var temp_var = parentObj.memoryReader[parentObj.registersHL](parentObj, parentObj.registersHL);
        var dirtySum = parentObj.registerA - temp_var - (parentObj.FCarry ? 1 : 0);
        parentObj.FHalfCarry = (parentObj.registerA & 15) - (temp_var & 15) - (parentObj.FCarry ? 1 : 0) < 0;
        parentObj.FCarry = dirtySum < 0;
        parentObj.registerA = dirtySum & 255;
        parentObj.FZero = parentObj.registerA == 0;
        parentObj.FSubtract = true;
    }),
    _wrap_(function (parentObj) {
        if (parentObj.FCarry) {
            parentObj.FZero = false;
            parentObj.FSubtract = parentObj.FHalfCarry = parentObj.FCarry = true;
            parentObj.registerA = 255;
        } else {
            parentObj.FHalfCarry = parentObj.FCarry = false;
            parentObj.FSubtract = parentObj.FZero = true;
            parentObj.registerA = 0;
        }
    }),
    _wrap_(function (parentObj) {
        parentObj.registerA &= parentObj.registerB;
        parentObj.FZero = parentObj.registerA == 0;
        parentObj.FHalfCarry = true;
        parentObj.FSubtract = parentObj.FCarry = false;
    }),
    _wrap_(function (parentObj) {
        parentObj.registerA &= parentObj.registerC;
        parentObj.FZero = parentObj.registerA == 0;
        parentObj.FHalfCarry = true;
        parentObj.FSubtract = parentObj.FCarry = false;
    }),
    _wrap_(function (parentObj) {
        parentObj.registerA &= parentObj.registerD;
        parentObj.FZero = parentObj.registerA == 0;
        parentObj.FHalfCarry = true;
        parentObj.FSubtract = parentObj.FCarry = false;
    }),
    _wrap_(function (parentObj) {
        parentObj.registerA &= parentObj.registerE;
        parentObj.FZero = parentObj.registerA == 0;
        parentObj.FHalfCarry = true;
        parentObj.FSubtract = parentObj.FCarry = false;
    }),
    _wrap_(function (parentObj) {
        parentObj.registerA &= parentObj.registersHL >> 8;
        parentObj.FZero = parentObj.registerA == 0;
        parentObj.FHalfCarry = true;
        parentObj.FSubtract = parentObj.FCarry = false;
    }),
    _wrap_(function (parentObj) {
        parentObj.registerA &= parentObj.registersHL;
        parentObj.FZero = parentObj.registerA == 0;
        parentObj.FHalfCarry = true;
        parentObj.FSubtract = parentObj.FCarry = false;
    }),
    _wrap_(function (parentObj) {
        parentObj.registerA &= parentObj.memoryReader[parentObj.registersHL](parentObj, parentObj.registersHL);
        parentObj.FZero = parentObj.registerA == 0;
        parentObj.FHalfCarry = true;
        parentObj.FSubtract = parentObj.FCarry = false;
    }),
    _wrap_(function (parentObj) {
        parentObj.FZero = parentObj.registerA == 0;
        parentObj.FHalfCarry = true;
        parentObj.FSubtract = parentObj.FCarry = false;
    }),
    _wrap_(function (parentObj) {
        parentObj.registerA ^= parentObj.registerB;
        parentObj.FZero = parentObj.registerA == 0;
        parentObj.FSubtract = parentObj.FHalfCarry = parentObj.FCarry = false;
    }),
    _wrap_(function (parentObj) {
        parentObj.registerA ^= parentObj.registerC;
        parentObj.FZero = parentObj.registerA == 0;
        parentObj.FSubtract = parentObj.FHalfCarry = parentObj.FCarry = false;
    }),
    _wrap_(function (parentObj) {
        parentObj.registerA ^= parentObj.registerD;
        parentObj.FZero = parentObj.registerA == 0;
        parentObj.FSubtract = parentObj.FHalfCarry = parentObj.FCarry = false;
    }),
    _wrap_(function (parentObj) {
        parentObj.registerA ^= parentObj.registerE;
        parentObj.FZero = parentObj.registerA == 0;
        parentObj.FSubtract = parentObj.FHalfCarry = parentObj.FCarry = false;
    }),
    _wrap_(function (parentObj) {
        parentObj.registerA ^= parentObj.registersHL >> 8;
        parentObj.FZero = parentObj.registerA == 0;
        parentObj.FSubtract = parentObj.FHalfCarry = parentObj.FCarry = false;
    }),
    _wrap_(function (parentObj) {
        parentObj.registerA ^= parentObj.registersHL & 255;
        parentObj.FZero = parentObj.registerA == 0;
        parentObj.FSubtract = parentObj.FHalfCarry = parentObj.FCarry = false;
    }),
    _wrap_(function (parentObj) {
        parentObj.registerA ^= parentObj.memoryReader[parentObj.registersHL](parentObj, parentObj.registersHL);
        parentObj.FZero = parentObj.registerA == 0;
        parentObj.FSubtract = parentObj.FHalfCarry = parentObj.FCarry = false;
    }),
    _wrap_(function (parentObj) {
        parentObj.registerA = 0;
        parentObj.FZero = true;
        parentObj.FSubtract = parentObj.FHalfCarry = parentObj.FCarry = false;
    }),
    _wrap_(function (parentObj) {
        parentObj.registerA |= parentObj.registerB;
        parentObj.FZero = parentObj.registerA == 0;
        parentObj.FSubtract = parentObj.FCarry = parentObj.FHalfCarry = false;
    }),
    _wrap_(function (parentObj) {
        parentObj.registerA |= parentObj.registerC;
        parentObj.FZero = parentObj.registerA == 0;
        parentObj.FSubtract = parentObj.FCarry = parentObj.FHalfCarry = false;
    }),
    _wrap_(function (parentObj) {
        parentObj.registerA |= parentObj.registerD;
        parentObj.FZero = parentObj.registerA == 0;
        parentObj.FSubtract = parentObj.FCarry = parentObj.FHalfCarry = false;
    }),
    _wrap_(function (parentObj) {
        parentObj.registerA |= parentObj.registerE;
        parentObj.FZero = parentObj.registerA == 0;
        parentObj.FSubtract = parentObj.FCarry = parentObj.FHalfCarry = false;
    }),
    _wrap_(function (parentObj) {
        parentObj.registerA |= parentObj.registersHL >> 8;
        parentObj.FZero = parentObj.registerA == 0;
        parentObj.FSubtract = parentObj.FCarry = parentObj.FHalfCarry = false;
    }),
    _wrap_(function (parentObj) {
        parentObj.registerA |= parentObj.registersHL & 255;
        parentObj.FZero = parentObj.registerA == 0;
        parentObj.FSubtract = parentObj.FCarry = parentObj.FHalfCarry = false;
    }),
    _wrap_(function (parentObj) {
        parentObj.registerA |= parentObj.memoryReader[parentObj.registersHL](parentObj, parentObj.registersHL);
        parentObj.FZero = parentObj.registerA == 0;
        parentObj.FSubtract = parentObj.FCarry = parentObj.FHalfCarry = false;
    }),
    _wrap_(function (parentObj) {
        parentObj.FZero = parentObj.registerA == 0;
        parentObj.FSubtract = parentObj.FCarry = parentObj.FHalfCarry = false;
    }),
    _wrap_(function (parentObj) {
        var dirtySum = parentObj.registerA - parentObj.registerB;
        parentObj.FHalfCarry = (dirtySum & 15) > (parentObj.registerA & 15);
        parentObj.FCarry = dirtySum < 0;
        parentObj.FZero = dirtySum == 0;
        parentObj.FSubtract = true;
    }),
    _wrap_(function (parentObj) {
        var dirtySum = parentObj.registerA - parentObj.registerC;
        parentObj.FHalfCarry = (dirtySum & 15) > (parentObj.registerA & 15);
        parentObj.FCarry = dirtySum < 0;
        parentObj.FZero = dirtySum == 0;
        parentObj.FSubtract = true;
    }),
    _wrap_(function (parentObj) {
        var dirtySum = parentObj.registerA - parentObj.registerD;
        parentObj.FHalfCarry = (dirtySum & 15) > (parentObj.registerA & 15);
        parentObj.FCarry = dirtySum < 0;
        parentObj.FZero = dirtySum == 0;
        parentObj.FSubtract = true;
    }),
    _wrap_(function (parentObj) {
        var dirtySum = parentObj.registerA - parentObj.registerE;
        parentObj.FHalfCarry = (dirtySum & 15) > (parentObj.registerA & 15);
        parentObj.FCarry = dirtySum < 0;
        parentObj.FZero = dirtySum == 0;
        parentObj.FSubtract = true;
    }),
    _wrap_(function (parentObj) {
        var dirtySum = parentObj.registerA - (parentObj.registersHL >> 8);
        parentObj.FHalfCarry = (dirtySum & 15) > (parentObj.registerA & 15);
        parentObj.FCarry = dirtySum < 0;
        parentObj.FZero = dirtySum == 0;
        parentObj.FSubtract = true;
    }),
    _wrap_(function (parentObj) {
        var dirtySum = parentObj.registerA - (parentObj.registersHL & 255);
        parentObj.FHalfCarry = (dirtySum & 15) > (parentObj.registerA & 15);
        parentObj.FCarry = dirtySum < 0;
        parentObj.FZero = dirtySum == 0;
        parentObj.FSubtract = true;
    }),
    _wrap_(function (parentObj) {
        var dirtySum = parentObj.registerA - parentObj.memoryReader[parentObj.registersHL](parentObj, parentObj.registersHL);
        parentObj.FHalfCarry = (dirtySum & 15) > (parentObj.registerA & 15);
        parentObj.FCarry = dirtySum < 0;
        parentObj.FZero = dirtySum == 0;
        parentObj.FSubtract = true;
    }),
    _wrap_(function (parentObj) {
        parentObj.FHalfCarry = parentObj.FCarry = false;
        parentObj.FZero = parentObj.FSubtract = true;
    }),
    _wrap_(function (parentObj) {
        if (!parentObj.FZero) {
            parentObj.programCounter = parentObj.memoryRead(parentObj.stackPointer + 1 & 65535) << 8 | parentObj.memoryReader[parentObj.stackPointer](parentObj, parentObj.stackPointer);
            parentObj.stackPointer = parentObj.stackPointer + 2 & 65535;
            parentObj.CPUTicks += 12;
        }
    }),
    _wrap_(function (parentObj) {
        parentObj.registerC = parentObj.memoryReader[parentObj.stackPointer](parentObj, parentObj.stackPointer);
        parentObj.registerB = parentObj.memoryRead(parentObj.stackPointer + 1 & 65535);
        parentObj.stackPointer = parentObj.stackPointer + 2 & 65535;
    }),
    _wrap_(function (parentObj) {
        if (!parentObj.FZero) {
            parentObj.programCounter = parentObj.memoryRead(parentObj.programCounter + 1 & 65535) << 8 | parentObj.memoryReader[parentObj.programCounter](parentObj, parentObj.programCounter);
            parentObj.CPUTicks += 4;
        } else {
            parentObj.programCounter = parentObj.programCounter + 2 & 65535;
        }
    }),
    _wrap_(function (parentObj) {
        parentObj.programCounter = parentObj.memoryRead(parentObj.programCounter + 1 & 65535) << 8 | parentObj.memoryReader[parentObj.programCounter](parentObj, parentObj.programCounter);
    }),
    _wrap_(function (parentObj) {
        if (!parentObj.FZero) {
            var temp_pc = parentObj.memoryRead(parentObj.programCounter + 1 & 65535) << 8 | parentObj.memoryReader[parentObj.programCounter](parentObj, parentObj.programCounter);
            parentObj.programCounter = parentObj.programCounter + 2 & 65535;
            parentObj.stackPointer = parentObj.stackPointer - 1 & 65535;
            parentObj.memoryWriter[parentObj.stackPointer](parentObj, parentObj.stackPointer, parentObj.programCounter >> 8);
            parentObj.stackPointer = parentObj.stackPointer - 1 & 65535;
            parentObj.memoryWriter[parentObj.stackPointer](parentObj, parentObj.stackPointer, parentObj.programCounter & 255);
            parentObj.programCounter = temp_pc;
            parentObj.CPUTicks += 12;
        } else {
            parentObj.programCounter = parentObj.programCounter + 2 & 65535;
        }
    }),
    _wrap_(function (parentObj) {
        parentObj.stackPointer = parentObj.stackPointer - 1 & 65535;
        parentObj.memoryWriter[parentObj.stackPointer](parentObj, parentObj.stackPointer, parentObj.registerB);
        parentObj.stackPointer = parentObj.stackPointer - 1 & 65535;
        parentObj.memoryWriter[parentObj.stackPointer](parentObj, parentObj.stackPointer, parentObj.registerC);
    }),
    _wrap_(function (parentObj) {
        var dirtySum = parentObj.registerA + parentObj.memoryReader[parentObj.programCounter](parentObj, parentObj.programCounter);
        parentObj.programCounter = parentObj.programCounter + 1 & 65535;
        parentObj.FHalfCarry = (dirtySum & 15) < (parentObj.registerA & 15);
        parentObj.FCarry = dirtySum > 255;
        parentObj.registerA = dirtySum & 255;
        parentObj.FZero = parentObj.registerA == 0;
        parentObj.FSubtract = false;
    }),
    _wrap_(function (parentObj) {
        parentObj.stackPointer = parentObj.stackPointer - 1 & 65535;
        parentObj.memoryWriter[parentObj.stackPointer](parentObj, parentObj.stackPointer, parentObj.programCounter >> 8);
        parentObj.stackPointer = parentObj.stackPointer - 1 & 65535;
        parentObj.memoryWriter[parentObj.stackPointer](parentObj, parentObj.stackPointer, parentObj.programCounter & 255);
        parentObj.programCounter = 0;
    }),
    _wrap_(function (parentObj) {
        if (parentObj.FZero) {
            parentObj.programCounter = parentObj.memoryRead(parentObj.stackPointer + 1 & 65535) << 8 | parentObj.memoryReader[parentObj.stackPointer](parentObj, parentObj.stackPointer);
            parentObj.stackPointer = parentObj.stackPointer + 2 & 65535;
            parentObj.CPUTicks += 12;
        }
    }),
    _wrap_(function (parentObj) {
        parentObj.programCounter = parentObj.memoryRead(parentObj.stackPointer + 1 & 65535) << 8 | parentObj.memoryReader[parentObj.stackPointer](parentObj, parentObj.stackPointer);
        parentObj.stackPointer = parentObj.stackPointer + 2 & 65535;
    }),
    _wrap_(function (parentObj) {
        if (parentObj.FZero) {
            parentObj.programCounter = parentObj.memoryRead(parentObj.programCounter + 1 & 65535) << 8 | parentObj.memoryReader[parentObj.programCounter](parentObj, parentObj.programCounter);
            parentObj.CPUTicks += 4;
        } else {
            parentObj.programCounter = parentObj.programCounter + 2 & 65535;
        }
    }),
    _wrap_(function (parentObj) {
        var opcode = parentObj.memoryReader[parentObj.programCounter](parentObj, parentObj.programCounter);
        parentObj.programCounter = parentObj.programCounter + 1 & 65535;
        parentObj.CPUTicks += parentObj.SecondaryTICKTable[opcode];
        parentObj.CBOPCODE[opcode](parentObj);
    }),
    _wrap_(function (parentObj) {
        if (parentObj.FZero) {
            var temp_pc = parentObj.memoryRead(parentObj.programCounter + 1 & 65535) << 8 | parentObj.memoryReader[parentObj.programCounter](parentObj, parentObj.programCounter);
            parentObj.programCounter = parentObj.programCounter + 2 & 65535;
            parentObj.stackPointer = parentObj.stackPointer - 1 & 65535;
            parentObj.memoryWriter[parentObj.stackPointer](parentObj, parentObj.stackPointer, parentObj.programCounter >> 8);
            parentObj.stackPointer = parentObj.stackPointer - 1 & 65535;
            parentObj.memoryWriter[parentObj.stackPointer](parentObj, parentObj.stackPointer, parentObj.programCounter & 255);
            parentObj.programCounter = temp_pc;
            parentObj.CPUTicks += 12;
        } else {
            parentObj.programCounter = parentObj.programCounter + 2 & 65535;
        }
    }),
    _wrap_(function (parentObj) {
        var temp_pc = parentObj.memoryRead(parentObj.programCounter + 1 & 65535) << 8 | parentObj.memoryReader[parentObj.programCounter](parentObj, parentObj.programCounter);
        parentObj.programCounter = parentObj.programCounter + 2 & 65535;
        parentObj.stackPointer = parentObj.stackPointer - 1 & 65535;
        parentObj.memoryWriter[parentObj.stackPointer](parentObj, parentObj.stackPointer, parentObj.programCounter >> 8);
        parentObj.stackPointer = parentObj.stackPointer - 1 & 65535;
        parentObj.memoryWriter[parentObj.stackPointer](parentObj, parentObj.stackPointer, parentObj.programCounter & 255);
        parentObj.programCounter = temp_pc;
    }),
    _wrap_(function (parentObj) {
        var tempValue = parentObj.memoryReader[parentObj.programCounter](parentObj, parentObj.programCounter);
        parentObj.programCounter = parentObj.programCounter + 1 & 65535;
        var dirtySum = parentObj.registerA + tempValue + (parentObj.FCarry ? 1 : 0);
        parentObj.FHalfCarry = (parentObj.registerA & 15) + (tempValue & 15) + (parentObj.FCarry ? 1 : 0) > 15;
        parentObj.FCarry = dirtySum > 255;
        parentObj.registerA = dirtySum & 255;
        parentObj.FZero = parentObj.registerA == 0;
        parentObj.FSubtract = false;
    }),
    _wrap_(function (parentObj) {
        parentObj.stackPointer = parentObj.stackPointer - 1 & 65535;
        parentObj.memoryWriter[parentObj.stackPointer](parentObj, parentObj.stackPointer, parentObj.programCounter >> 8);
        parentObj.stackPointer = parentObj.stackPointer - 1 & 65535;
        parentObj.memoryWriter[parentObj.stackPointer](parentObj, parentObj.stackPointer, parentObj.programCounter & 255);
        parentObj.programCounter = 8;
    }),
    _wrap_(function (parentObj) {
        if (!parentObj.FCarry) {
            parentObj.programCounter = parentObj.memoryRead(parentObj.stackPointer + 1 & 65535) << 8 | parentObj.memoryReader[parentObj.stackPointer](parentObj, parentObj.stackPointer);
            parentObj.stackPointer = parentObj.stackPointer + 2 & 65535;
            parentObj.CPUTicks += 12;
        }
    }),
    _wrap_(function (parentObj) {
        parentObj.registerE = parentObj.memoryReader[parentObj.stackPointer](parentObj, parentObj.stackPointer);
        parentObj.registerD = parentObj.memoryRead(parentObj.stackPointer + 1 & 65535);
        parentObj.stackPointer = parentObj.stackPointer + 2 & 65535;
    }),
    _wrap_(function (parentObj) {
        if (!parentObj.FCarry) {
            parentObj.programCounter = parentObj.memoryRead(parentObj.programCounter + 1 & 65535) << 8 | parentObj.memoryReader[parentObj.programCounter](parentObj, parentObj.programCounter);
            parentObj.CPUTicks += 4;
        } else {
            parentObj.programCounter = parentObj.programCounter + 2 & 65535;
        }
    }),
    _wrap_(function (parentObj) {
        cout('Illegal op code 0xD3 called, pausing emulation.', 2);
        pause();
    }),
    _wrap_(function (parentObj) {
        if (!parentObj.FCarry) {
            var temp_pc = parentObj.memoryRead(parentObj.programCounter + 1 & 65535) << 8 | parentObj.memoryReader[parentObj.programCounter](parentObj, parentObj.programCounter);
            parentObj.programCounter = parentObj.programCounter + 2 & 65535;
            parentObj.stackPointer = parentObj.stackPointer - 1 & 65535;
            parentObj.memoryWriter[parentObj.stackPointer](parentObj, parentObj.stackPointer, parentObj.programCounter >> 8);
            parentObj.stackPointer = parentObj.stackPointer - 1 & 65535;
            parentObj.memoryWriter[parentObj.stackPointer](parentObj, parentObj.stackPointer, parentObj.programCounter & 255);
            parentObj.programCounter = temp_pc;
            parentObj.CPUTicks += 12;
        } else {
            parentObj.programCounter = parentObj.programCounter + 2 & 65535;
        }
    }),
    _wrap_(function (parentObj) {
        parentObj.stackPointer = parentObj.stackPointer - 1 & 65535;
        parentObj.memoryWriter[parentObj.stackPointer](parentObj, parentObj.stackPointer, parentObj.registerD);
        parentObj.stackPointer = parentObj.stackPointer - 1 & 65535;
        parentObj.memoryWriter[parentObj.stackPointer](parentObj, parentObj.stackPointer, parentObj.registerE);
    }),
    _wrap_(function (parentObj) {
        var dirtySum = parentObj.registerA - parentObj.memoryReader[parentObj.programCounter](parentObj, parentObj.programCounter);
        parentObj.programCounter = parentObj.programCounter + 1 & 65535;
        parentObj.FHalfCarry = (parentObj.registerA & 15) < (dirtySum & 15);
        parentObj.FCarry = dirtySum < 0;
        parentObj.registerA = dirtySum & 255;
        parentObj.FZero = dirtySum == 0;
        parentObj.FSubtract = true;
    }),
    _wrap_(function (parentObj) {
        parentObj.stackPointer = parentObj.stackPointer - 1 & 65535;
        parentObj.memoryWriter[parentObj.stackPointer](parentObj, parentObj.stackPointer, parentObj.programCounter >> 8);
        parentObj.stackPointer = parentObj.stackPointer - 1 & 65535;
        parentObj.memoryWriter[parentObj.stackPointer](parentObj, parentObj.stackPointer, parentObj.programCounter & 255);
        parentObj.programCounter = 16;
    }),
    _wrap_(function (parentObj) {
        if (parentObj.FCarry) {
            parentObj.programCounter = parentObj.memoryRead(parentObj.stackPointer + 1 & 65535) << 8 | parentObj.memoryReader[parentObj.stackPointer](parentObj, parentObj.stackPointer);
            parentObj.stackPointer = parentObj.stackPointer + 2 & 65535;
            parentObj.CPUTicks += 12;
        }
    }),
    _wrap_(function (parentObj) {
        parentObj.programCounter = parentObj.memoryRead(parentObj.stackPointer + 1 & 65535) << 8 | parentObj.memoryReader[parentObj.stackPointer](parentObj, parentObj.stackPointer);
        parentObj.stackPointer = parentObj.stackPointer + 2 & 65535;
        parentObj.IRQEnableDelay = parentObj.IRQEnableDelay == 2 || parentObj.memoryReader[parentObj.programCounter](parentObj, parentObj.programCounter) == 118 ? 1 : 2;
    }),
    _wrap_(function (parentObj) {
        if (parentObj.FCarry) {
            parentObj.programCounter = parentObj.memoryRead(parentObj.programCounter + 1 & 65535) << 8 | parentObj.memoryReader[parentObj.programCounter](parentObj, parentObj.programCounter);
            parentObj.CPUTicks += 4;
        } else {
            parentObj.programCounter = parentObj.programCounter + 2 & 65535;
        }
    }),
    _wrap_(function (parentObj) {
        cout('Illegal op code 0xDB called, pausing emulation.', 2);
        pause();
    }),
    _wrap_(function (parentObj) {
        if (parentObj.FCarry) {
            var temp_pc = parentObj.memoryRead(parentObj.programCounter + 1 & 65535) << 8 | parentObj.memoryReader[parentObj.programCounter](parentObj, parentObj.programCounter);
            parentObj.programCounter = parentObj.programCounter + 2 & 65535;
            parentObj.stackPointer = parentObj.stackPointer - 1 & 65535;
            parentObj.memoryWriter[parentObj.stackPointer](parentObj, parentObj.stackPointer, parentObj.programCounter >> 8);
            parentObj.stackPointer = parentObj.stackPointer - 1 & 65535;
            parentObj.memoryWriter[parentObj.stackPointer](parentObj, parentObj.stackPointer, parentObj.programCounter & 255);
            parentObj.programCounter = temp_pc;
            parentObj.CPUTicks += 12;
        } else {
            parentObj.programCounter = parentObj.programCounter + 2 & 65535;
        }
    }),
    _wrap_(function (parentObj) {
        cout('Illegal op code 0xDD called, pausing emulation.', 2);
        pause();
    }),
    _wrap_(function (parentObj) {
        var temp_var = parentObj.memoryReader[parentObj.programCounter](parentObj, parentObj.programCounter);
        parentObj.programCounter = parentObj.programCounter + 1 & 65535;
        var dirtySum = parentObj.registerA - temp_var - (parentObj.FCarry ? 1 : 0);
        parentObj.FHalfCarry = (parentObj.registerA & 15) - (temp_var & 15) - (parentObj.FCarry ? 1 : 0) < 0;
        parentObj.FCarry = dirtySum < 0;
        parentObj.registerA = dirtySum & 255;
        parentObj.FZero = parentObj.registerA == 0;
        parentObj.FSubtract = true;
    }),
    _wrap_(function (parentObj) {
        parentObj.stackPointer = parentObj.stackPointer - 1 & 65535;
        parentObj.memoryWriter[parentObj.stackPointer](parentObj, parentObj.stackPointer, parentObj.programCounter >> 8);
        parentObj.stackPointer = parentObj.stackPointer - 1 & 65535;
        parentObj.memoryWriter[parentObj.stackPointer](parentObj, parentObj.stackPointer, parentObj.programCounter & 255);
        parentObj.programCounter = 24;
    }),
    _wrap_(function (parentObj) {
        parentObj.memoryHighWrite(parentObj.memoryReader[parentObj.programCounter](parentObj, parentObj.programCounter), parentObj.registerA);
        parentObj.programCounter = parentObj.programCounter + 1 & 65535;
    }),
    _wrap_(function (parentObj) {
        parentObj.registersHL = parentObj.memoryRead(parentObj.stackPointer + 1 & 65535) << 8 | parentObj.memoryReader[parentObj.stackPointer](parentObj, parentObj.stackPointer);
        parentObj.stackPointer = parentObj.stackPointer + 2 & 65535;
    }),
    _wrap_(function (parentObj) {
        parentObj.memoryHighWriter[parentObj.registerC](parentObj, parentObj.registerC, parentObj.registerA);
    }),
    _wrap_(function (parentObj) {
        cout('Illegal op code 0xE3 called, pausing emulation.', 2);
        pause();
    }),
    _wrap_(function (parentObj) {
        cout('Illegal op code 0xE4 called, pausing emulation.', 2);
        pause();
    }),
    _wrap_(function (parentObj) {
        parentObj.stackPointer = parentObj.stackPointer - 1 & 65535;
        parentObj.memoryWriter[parentObj.stackPointer](parentObj, parentObj.stackPointer, parentObj.registersHL >> 8);
        parentObj.stackPointer = parentObj.stackPointer - 1 & 65535;
        parentObj.memoryWriter[parentObj.stackPointer](parentObj, parentObj.stackPointer, parentObj.registersHL & 255);
    }),
    _wrap_(function (parentObj) {
        parentObj.registerA &= parentObj.memoryReader[parentObj.programCounter](parentObj, parentObj.programCounter);
        parentObj.programCounter = parentObj.programCounter + 1 & 65535;
        parentObj.FZero = parentObj.registerA == 0;
        parentObj.FHalfCarry = true;
        parentObj.FSubtract = parentObj.FCarry = false;
    }),
    _wrap_(function (parentObj) {
        parentObj.stackPointer = parentObj.stackPointer - 1 & 65535;
        parentObj.memoryWriter[parentObj.stackPointer](parentObj, parentObj.stackPointer, parentObj.programCounter >> 8);
        parentObj.stackPointer = parentObj.stackPointer - 1 & 65535;
        parentObj.memoryWriter[parentObj.stackPointer](parentObj, parentObj.stackPointer, parentObj.programCounter & 255);
        parentObj.programCounter = 32;
    }),
    _wrap_(function (parentObj) {
        var temp_value2 = parentObj.memoryReader[parentObj.programCounter](parentObj, parentObj.programCounter) << 24 >> 24;
        parentObj.programCounter = parentObj.programCounter + 1 & 65535;
        var temp_value = parentObj.stackPointer + temp_value2 & 65535;
        temp_value2 = parentObj.stackPointer ^ temp_value2 ^ temp_value;
        parentObj.stackPointer = temp_value;
        parentObj.FCarry = (temp_value2 & 256) == 256;
        parentObj.FHalfCarry = (temp_value2 & 16) == 16;
        parentObj.FZero = parentObj.FSubtract = false;
    }),
    _wrap_(function (parentObj) {
        parentObj.programCounter = parentObj.registersHL;
    }),
    _wrap_(function (parentObj) {
        parentObj.memoryWrite(parentObj.memoryRead(parentObj.programCounter + 1 & 65535) << 8 | parentObj.memoryReader[parentObj.programCounter](parentObj, parentObj.programCounter), parentObj.registerA);
        parentObj.programCounter = parentObj.programCounter + 2 & 65535;
    }),
    _wrap_(function (parentObj) {
        cout('Illegal op code 0xEB called, pausing emulation.', 2);
        pause();
    }),
    _wrap_(function (parentObj) {
        cout('Illegal op code 0xEC called, pausing emulation.', 2);
        pause();
    }),
    _wrap_(function (parentObj) {
        cout('Illegal op code 0xED called, pausing emulation.', 2);
        pause();
    }),
    _wrap_(function (parentObj) {
        parentObj.registerA ^= parentObj.memoryReader[parentObj.programCounter](parentObj, parentObj.programCounter);
        parentObj.programCounter = parentObj.programCounter + 1 & 65535;
        parentObj.FZero = parentObj.registerA == 0;
        parentObj.FSubtract = parentObj.FHalfCarry = parentObj.FCarry = false;
    }),
    _wrap_(function (parentObj) {
        parentObj.stackPointer = parentObj.stackPointer - 1 & 65535;
        parentObj.memoryWriter[parentObj.stackPointer](parentObj, parentObj.stackPointer, parentObj.programCounter >> 8);
        parentObj.stackPointer = parentObj.stackPointer - 1 & 65535;
        parentObj.memoryWriter[parentObj.stackPointer](parentObj, parentObj.stackPointer, parentObj.programCounter & 255);
        parentObj.programCounter = 40;
    }),
    _wrap_(function (parentObj) {
        parentObj.registerA = parentObj.memoryHighRead(parentObj.memoryReader[parentObj.programCounter](parentObj, parentObj.programCounter));
        parentObj.programCounter = parentObj.programCounter + 1 & 65535;
    }),
    _wrap_(function (parentObj) {
        var temp_var = parentObj.memoryReader[parentObj.stackPointer](parentObj, parentObj.stackPointer);
        parentObj.FZero = temp_var > 127;
        parentObj.FSubtract = (temp_var & 64) == 64;
        parentObj.FHalfCarry = (temp_var & 32) == 32;
        parentObj.FCarry = (temp_var & 16) == 16;
        parentObj.registerA = parentObj.memoryRead(parentObj.stackPointer + 1 & 65535);
        parentObj.stackPointer = parentObj.stackPointer + 2 & 65535;
    }),
    _wrap_(function (parentObj) {
        parentObj.registerA = parentObj.memoryHighReader[parentObj.registerC](parentObj, parentObj.registerC);
    }),
    _wrap_(function (parentObj) {
        parentObj.IME = false;
        parentObj.IRQEnableDelay = 0;
    }),
    _wrap_(function (parentObj) {
        cout('Illegal op code 0xF4 called, pausing emulation.', 2);
        pause();
    }),
    _wrap_(function (parentObj) {
        parentObj.stackPointer = parentObj.stackPointer - 1 & 65535;
        parentObj.memoryWriter[parentObj.stackPointer](parentObj, parentObj.stackPointer, parentObj.registerA);
        parentObj.stackPointer = parentObj.stackPointer - 1 & 65535;
        parentObj.memoryWriter[parentObj.stackPointer](parentObj, parentObj.stackPointer, (parentObj.FZero ? 128 : 0) | (parentObj.FSubtract ? 64 : 0) | (parentObj.FHalfCarry ? 32 : 0) | (parentObj.FCarry ? 16 : 0));
    }),
    _wrap_(function (parentObj) {
        parentObj.registerA |= parentObj.memoryReader[parentObj.programCounter](parentObj, parentObj.programCounter);
        parentObj.FZero = parentObj.registerA == 0;
        parentObj.programCounter = parentObj.programCounter + 1 & 65535;
        parentObj.FSubtract = parentObj.FCarry = parentObj.FHalfCarry = false;
    }),
    _wrap_(function (parentObj) {
        parentObj.stackPointer = parentObj.stackPointer - 1 & 65535;
        parentObj.memoryWriter[parentObj.stackPointer](parentObj, parentObj.stackPointer, parentObj.programCounter >> 8);
        parentObj.stackPointer = parentObj.stackPointer - 1 & 65535;
        parentObj.memoryWriter[parentObj.stackPointer](parentObj, parentObj.stackPointer, parentObj.programCounter & 255);
        parentObj.programCounter = 48;
    }),
    _wrap_(function (parentObj) {
        var temp_var = parentObj.memoryReader[parentObj.programCounter](parentObj, parentObj.programCounter) << 24 >> 24;
        parentObj.programCounter = parentObj.programCounter + 1 & 65535;
        parentObj.registersHL = parentObj.stackPointer + temp_var & 65535;
        temp_var = parentObj.stackPointer ^ temp_var ^ parentObj.registersHL;
        parentObj.FCarry = (temp_var & 256) == 256;
        parentObj.FHalfCarry = (temp_var & 16) == 16;
        parentObj.FZero = parentObj.FSubtract = false;
    }),
    _wrap_(function (parentObj) {
        parentObj.stackPointer = parentObj.registersHL;
    }),
    _wrap_(function (parentObj) {
        parentObj.registerA = parentObj.memoryRead(parentObj.memoryRead(parentObj.programCounter + 1 & 65535) << 8 | parentObj.memoryReader[parentObj.programCounter](parentObj, parentObj.programCounter));
        parentObj.programCounter = parentObj.programCounter + 2 & 65535;
    }),
    _wrap_(function (parentObj) {
        parentObj.IRQEnableDelay = parentObj.IRQEnableDelay == 2 || parentObj.memoryReader[parentObj.programCounter](parentObj, parentObj.programCounter) == 118 ? 1 : 2;
    }),
    _wrap_(function (parentObj) {
        cout('Illegal op code 0xFC called, pausing emulation.', 2);
        pause();
    }),
    _wrap_(function (parentObj) {
        cout('Illegal op code 0xFD called, pausing emulation.', 2);
        pause();
    }),
    _wrap_(function (parentObj) {
        var dirtySum = parentObj.registerA - parentObj.memoryReader[parentObj.programCounter](parentObj, parentObj.programCounter);
        parentObj.programCounter = parentObj.programCounter + 1 & 65535;
        parentObj.FHalfCarry = (dirtySum & 15) > (parentObj.registerA & 15);
        parentObj.FCarry = dirtySum < 0;
        parentObj.FZero = dirtySum == 0;
        parentObj.FSubtract = true;
    }),
    _wrap_(function (parentObj) {
        parentObj.stackPointer = parentObj.stackPointer - 1 & 65535;
        parentObj.memoryWriter[parentObj.stackPointer](parentObj, parentObj.stackPointer, parentObj.programCounter >> 8);
        parentObj.stackPointer = parentObj.stackPointer - 1 & 65535;
        parentObj.memoryWriter[parentObj.stackPointer](parentObj, parentObj.stackPointer, parentObj.programCounter & 255);
        parentObj.programCounter = 56;
    })
];
GameBoyCore.prototype.CBOPCODE = [
    _wrap_(function (parentObj) {
        parentObj.FCarry = parentObj.registerB > 127;
        parentObj.registerB = parentObj.registerB << 1 & 255 | (parentObj.FCarry ? 1 : 0);
        parentObj.FHalfCarry = parentObj.FSubtract = false;
        parentObj.FZero = parentObj.registerB == 0;
    }),
    _wrap_(function (parentObj) {
        parentObj.FCarry = parentObj.registerC > 127;
        parentObj.registerC = parentObj.registerC << 1 & 255 | (parentObj.FCarry ? 1 : 0);
        parentObj.FHalfCarry = parentObj.FSubtract = false;
        parentObj.FZero = parentObj.registerC == 0;
    }),
    _wrap_(function (parentObj) {
        parentObj.FCarry = parentObj.registerD > 127;
        parentObj.registerD = parentObj.registerD << 1 & 255 | (parentObj.FCarry ? 1 : 0);
        parentObj.FHalfCarry = parentObj.FSubtract = false;
        parentObj.FZero = parentObj.registerD == 0;
    }),
    _wrap_(function (parentObj) {
        parentObj.FCarry = parentObj.registerE > 127;
        parentObj.registerE = parentObj.registerE << 1 & 255 | (parentObj.FCarry ? 1 : 0);
        parentObj.FHalfCarry = parentObj.FSubtract = false;
        parentObj.FZero = parentObj.registerE == 0;
    }),
    _wrap_(function (parentObj) {
        parentObj.FCarry = parentObj.registersHL > 32767;
        parentObj.registersHL = parentObj.registersHL << 1 & 65024 | (parentObj.FCarry ? 256 : 0) | parentObj.registersHL & 255;
        parentObj.FHalfCarry = parentObj.FSubtract = false;
        parentObj.FZero = parentObj.registersHL < 256;
    }),
    _wrap_(function (parentObj) {
        parentObj.FCarry = (parentObj.registersHL & 128) == 128;
        parentObj.registersHL = parentObj.registersHL & 65280 | parentObj.registersHL << 1 & 255 | (parentObj.FCarry ? 1 : 0);
        parentObj.FHalfCarry = parentObj.FSubtract = false;
        parentObj.FZero = (parentObj.registersHL & 255) == 0;
    }),
    _wrap_(function (parentObj) {
        var temp_var = parentObj.memoryReader[parentObj.registersHL](parentObj, parentObj.registersHL);
        parentObj.FCarry = temp_var > 127;
        temp_var = temp_var << 1 & 255 | (parentObj.FCarry ? 1 : 0);
        parentObj.memoryWriter[parentObj.registersHL](parentObj, parentObj.registersHL, temp_var);
        parentObj.FHalfCarry = parentObj.FSubtract = false;
        parentObj.FZero = temp_var == 0;
    }),
    _wrap_(function (parentObj) {
        parentObj.FCarry = parentObj.registerA > 127;
        parentObj.registerA = parentObj.registerA << 1 & 255 | (parentObj.FCarry ? 1 : 0);
        parentObj.FHalfCarry = parentObj.FSubtract = false;
        parentObj.FZero = parentObj.registerA == 0;
    }),
    _wrap_(function (parentObj) {
        parentObj.FCarry = (parentObj.registerB & 1) == 1;
        parentObj.registerB = (parentObj.FCarry ? 128 : 0) | parentObj.registerB >> 1;
        parentObj.FHalfCarry = parentObj.FSubtract = false;
        parentObj.FZero = parentObj.registerB == 0;
    }),
    _wrap_(function (parentObj) {
        parentObj.FCarry = (parentObj.registerC & 1) == 1;
        parentObj.registerC = (parentObj.FCarry ? 128 : 0) | parentObj.registerC >> 1;
        parentObj.FHalfCarry = parentObj.FSubtract = false;
        parentObj.FZero = parentObj.registerC == 0;
    }),
    _wrap_(function (parentObj) {
        parentObj.FCarry = (parentObj.registerD & 1) == 1;
        parentObj.registerD = (parentObj.FCarry ? 128 : 0) | parentObj.registerD >> 1;
        parentObj.FHalfCarry = parentObj.FSubtract = false;
        parentObj.FZero = parentObj.registerD == 0;
    }),
    _wrap_(function (parentObj) {
        parentObj.FCarry = (parentObj.registerE & 1) == 1;
        parentObj.registerE = (parentObj.FCarry ? 128 : 0) | parentObj.registerE >> 1;
        parentObj.FHalfCarry = parentObj.FSubtract = false;
        parentObj.FZero = parentObj.registerE == 0;
    }),
    _wrap_(function (parentObj) {
        parentObj.FCarry = (parentObj.registersHL & 256) == 256;
        parentObj.registersHL = (parentObj.FCarry ? 32768 : 0) | parentObj.registersHL >> 1 & 65280 | parentObj.registersHL & 255;
        parentObj.FHalfCarry = parentObj.FSubtract = false;
        parentObj.FZero = parentObj.registersHL < 256;
    }),
    _wrap_(function (parentObj) {
        parentObj.FCarry = (parentObj.registersHL & 1) == 1;
        parentObj.registersHL = parentObj.registersHL & 65280 | (parentObj.FCarry ? 128 : 0) | (parentObj.registersHL & 255) >> 1;
        parentObj.FHalfCarry = parentObj.FSubtract = false;
        parentObj.FZero = (parentObj.registersHL & 255) == 0;
    }),
    _wrap_(function (parentObj) {
        var temp_var = parentObj.memoryReader[parentObj.registersHL](parentObj, parentObj.registersHL);
        parentObj.FCarry = (temp_var & 1) == 1;
        temp_var = (parentObj.FCarry ? 128 : 0) | temp_var >> 1;
        parentObj.memoryWriter[parentObj.registersHL](parentObj, parentObj.registersHL, temp_var);
        parentObj.FHalfCarry = parentObj.FSubtract = false;
        parentObj.FZero = temp_var == 0;
    }),
    _wrap_(function (parentObj) {
        parentObj.FCarry = (parentObj.registerA & 1) == 1;
        parentObj.registerA = (parentObj.FCarry ? 128 : 0) | parentObj.registerA >> 1;
        parentObj.FHalfCarry = parentObj.FSubtract = false;
        parentObj.FZero = parentObj.registerA == 0;
    }),
    _wrap_(function (parentObj) {
        var newFCarry = parentObj.registerB > 127;
        parentObj.registerB = parentObj.registerB << 1 & 255 | (parentObj.FCarry ? 1 : 0);
        parentObj.FCarry = newFCarry;
        parentObj.FHalfCarry = parentObj.FSubtract = false;
        parentObj.FZero = parentObj.registerB == 0;
    }),
    _wrap_(function (parentObj) {
        var newFCarry = parentObj.registerC > 127;
        parentObj.registerC = parentObj.registerC << 1 & 255 | (parentObj.FCarry ? 1 : 0);
        parentObj.FCarry = newFCarry;
        parentObj.FHalfCarry = parentObj.FSubtract = false;
        parentObj.FZero = parentObj.registerC == 0;
    }),
    _wrap_(function (parentObj) {
        var newFCarry = parentObj.registerD > 127;
        parentObj.registerD = parentObj.registerD << 1 & 255 | (parentObj.FCarry ? 1 : 0);
        parentObj.FCarry = newFCarry;
        parentObj.FHalfCarry = parentObj.FSubtract = false;
        parentObj.FZero = parentObj.registerD == 0;
    }),
    _wrap_(function (parentObj) {
        var newFCarry = parentObj.registerE > 127;
        parentObj.registerE = parentObj.registerE << 1 & 255 | (parentObj.FCarry ? 1 : 0);
        parentObj.FCarry = newFCarry;
        parentObj.FHalfCarry = parentObj.FSubtract = false;
        parentObj.FZero = parentObj.registerE == 0;
    }),
    _wrap_(function (parentObj) {
        var newFCarry = parentObj.registersHL > 32767;
        parentObj.registersHL = parentObj.registersHL << 1 & 65024 | (parentObj.FCarry ? 256 : 0) | parentObj.registersHL & 255;
        parentObj.FCarry = newFCarry;
        parentObj.FHalfCarry = parentObj.FSubtract = false;
        parentObj.FZero = parentObj.registersHL < 256;
    }),
    _wrap_(function (parentObj) {
        var newFCarry = (parentObj.registersHL & 128) == 128;
        parentObj.registersHL = parentObj.registersHL & 65280 | parentObj.registersHL << 1 & 255 | (parentObj.FCarry ? 1 : 0);
        parentObj.FCarry = newFCarry;
        parentObj.FHalfCarry = parentObj.FSubtract = false;
        parentObj.FZero = (parentObj.registersHL & 255) == 0;
    }),
    _wrap_(function (parentObj) {
        var temp_var = parentObj.memoryReader[parentObj.registersHL](parentObj, parentObj.registersHL);
        var newFCarry = temp_var > 127;
        temp_var = temp_var << 1 & 255 | (parentObj.FCarry ? 1 : 0);
        parentObj.FCarry = newFCarry;
        parentObj.memoryWriter[parentObj.registersHL](parentObj, parentObj.registersHL, temp_var);
        parentObj.FHalfCarry = parentObj.FSubtract = false;
        parentObj.FZero = temp_var == 0;
    }),
    _wrap_(function (parentObj) {
        var newFCarry = parentObj.registerA > 127;
        parentObj.registerA = parentObj.registerA << 1 & 255 | (parentObj.FCarry ? 1 : 0);
        parentObj.FCarry = newFCarry;
        parentObj.FHalfCarry = parentObj.FSubtract = false;
        parentObj.FZero = parentObj.registerA == 0;
    }),
    _wrap_(function (parentObj) {
        var newFCarry = (parentObj.registerB & 1) == 1;
        parentObj.registerB = (parentObj.FCarry ? 128 : 0) | parentObj.registerB >> 1;
        parentObj.FCarry = newFCarry;
        parentObj.FHalfCarry = parentObj.FSubtract = false;
        parentObj.FZero = parentObj.registerB == 0;
    }),
    _wrap_(function (parentObj) {
        var newFCarry = (parentObj.registerC & 1) == 1;
        parentObj.registerC = (parentObj.FCarry ? 128 : 0) | parentObj.registerC >> 1;
        parentObj.FCarry = newFCarry;
        parentObj.FHalfCarry = parentObj.FSubtract = false;
        parentObj.FZero = parentObj.registerC == 0;
    }),
    _wrap_(function (parentObj) {
        var newFCarry = (parentObj.registerD & 1) == 1;
        parentObj.registerD = (parentObj.FCarry ? 128 : 0) | parentObj.registerD >> 1;
        parentObj.FCarry = newFCarry;
        parentObj.FHalfCarry = parentObj.FSubtract = false;
        parentObj.FZero = parentObj.registerD == 0;
    }),
    _wrap_(function (parentObj) {
        var newFCarry = (parentObj.registerE & 1) == 1;
        parentObj.registerE = (parentObj.FCarry ? 128 : 0) | parentObj.registerE >> 1;
        parentObj.FCarry = newFCarry;
        parentObj.FHalfCarry = parentObj.FSubtract = false;
        parentObj.FZero = parentObj.registerE == 0;
    }),
    _wrap_(function (parentObj) {
        var newFCarry = (parentObj.registersHL & 256) == 256;
        parentObj.registersHL = (parentObj.FCarry ? 32768 : 0) | parentObj.registersHL >> 1 & 65280 | parentObj.registersHL & 255;
        parentObj.FCarry = newFCarry;
        parentObj.FHalfCarry = parentObj.FSubtract = false;
        parentObj.FZero = parentObj.registersHL < 256;
    }),
    _wrap_(function (parentObj) {
        var newFCarry = (parentObj.registersHL & 1) == 1;
        parentObj.registersHL = parentObj.registersHL & 65280 | (parentObj.FCarry ? 128 : 0) | (parentObj.registersHL & 255) >> 1;
        parentObj.FCarry = newFCarry;
        parentObj.FHalfCarry = parentObj.FSubtract = false;
        parentObj.FZero = (parentObj.registersHL & 255) == 0;
    }),
    _wrap_(function (parentObj) {
        var temp_var = parentObj.memoryReader[parentObj.registersHL](parentObj, parentObj.registersHL);
        var newFCarry = (temp_var & 1) == 1;
        temp_var = (parentObj.FCarry ? 128 : 0) | temp_var >> 1;
        parentObj.FCarry = newFCarry;
        parentObj.memoryWriter[parentObj.registersHL](parentObj, parentObj.registersHL, temp_var);
        parentObj.FHalfCarry = parentObj.FSubtract = false;
        parentObj.FZero = temp_var == 0;
    }),
    _wrap_(function (parentObj) {
        var newFCarry = (parentObj.registerA & 1) == 1;
        parentObj.registerA = (parentObj.FCarry ? 128 : 0) | parentObj.registerA >> 1;
        parentObj.FCarry = newFCarry;
        parentObj.FHalfCarry = parentObj.FSubtract = false;
        parentObj.FZero = parentObj.registerA == 0;
    }),
    _wrap_(function (parentObj) {
        parentObj.FCarry = parentObj.registerB > 127;
        parentObj.registerB = parentObj.registerB << 1 & 255;
        parentObj.FHalfCarry = parentObj.FSubtract = false;
        parentObj.FZero = parentObj.registerB == 0;
    }),
    _wrap_(function (parentObj) {
        parentObj.FCarry = parentObj.registerC > 127;
        parentObj.registerC = parentObj.registerC << 1 & 255;
        parentObj.FHalfCarry = parentObj.FSubtract = false;
        parentObj.FZero = parentObj.registerC == 0;
    }),
    _wrap_(function (parentObj) {
        parentObj.FCarry = parentObj.registerD > 127;
        parentObj.registerD = parentObj.registerD << 1 & 255;
        parentObj.FHalfCarry = parentObj.FSubtract = false;
        parentObj.FZero = parentObj.registerD == 0;
    }),
    _wrap_(function (parentObj) {
        parentObj.FCarry = parentObj.registerE > 127;
        parentObj.registerE = parentObj.registerE << 1 & 255;
        parentObj.FHalfCarry = parentObj.FSubtract = false;
        parentObj.FZero = parentObj.registerE == 0;
    }),
    _wrap_(function (parentObj) {
        parentObj.FCarry = parentObj.registersHL > 32767;
        parentObj.registersHL = parentObj.registersHL << 1 & 65024 | parentObj.registersHL & 255;
        parentObj.FHalfCarry = parentObj.FSubtract = false;
        parentObj.FZero = parentObj.registersHL < 256;
    }),
    _wrap_(function (parentObj) {
        parentObj.FCarry = (parentObj.registersHL & 128) == 128;
        parentObj.registersHL = parentObj.registersHL & 65280 | parentObj.registersHL << 1 & 255;
        parentObj.FHalfCarry = parentObj.FSubtract = false;
        parentObj.FZero = (parentObj.registersHL & 255) == 0;
    }),
    _wrap_(function (parentObj) {
        var temp_var = parentObj.memoryReader[parentObj.registersHL](parentObj, parentObj.registersHL);
        parentObj.FCarry = temp_var > 127;
        temp_var = temp_var << 1 & 255;
        parentObj.memoryWriter[parentObj.registersHL](parentObj, parentObj.registersHL, temp_var);
        parentObj.FHalfCarry = parentObj.FSubtract = false;
        parentObj.FZero = temp_var == 0;
    }),
    _wrap_(function (parentObj) {
        parentObj.FCarry = parentObj.registerA > 127;
        parentObj.registerA = parentObj.registerA << 1 & 255;
        parentObj.FHalfCarry = parentObj.FSubtract = false;
        parentObj.FZero = parentObj.registerA == 0;
    }),
    _wrap_(function (parentObj) {
        parentObj.FCarry = (parentObj.registerB & 1) == 1;
        parentObj.registerB = parentObj.registerB & 128 | parentObj.registerB >> 1;
        parentObj.FHalfCarry = parentObj.FSubtract = false;
        parentObj.FZero = parentObj.registerB == 0;
    }),
    _wrap_(function (parentObj) {
        parentObj.FCarry = (parentObj.registerC & 1) == 1;
        parentObj.registerC = parentObj.registerC & 128 | parentObj.registerC >> 1;
        parentObj.FHalfCarry = parentObj.FSubtract = false;
        parentObj.FZero = parentObj.registerC == 0;
    }),
    _wrap_(function (parentObj) {
        parentObj.FCarry = (parentObj.registerD & 1) == 1;
        parentObj.registerD = parentObj.registerD & 128 | parentObj.registerD >> 1;
        parentObj.FHalfCarry = parentObj.FSubtract = false;
        parentObj.FZero = parentObj.registerD == 0;
    }),
    _wrap_(function (parentObj) {
        parentObj.FCarry = (parentObj.registerE & 1) == 1;
        parentObj.registerE = parentObj.registerE & 128 | parentObj.registerE >> 1;
        parentObj.FHalfCarry = parentObj.FSubtract = false;
        parentObj.FZero = parentObj.registerE == 0;
    }),
    _wrap_(function (parentObj) {
        parentObj.FCarry = (parentObj.registersHL & 256) == 256;
        parentObj.registersHL = parentObj.registersHL >> 1 & 65280 | parentObj.registersHL & 33023;
        parentObj.FHalfCarry = parentObj.FSubtract = false;
        parentObj.FZero = parentObj.registersHL < 256;
    }),
    _wrap_(function (parentObj) {
        parentObj.FCarry = (parentObj.registersHL & 1) == 1;
        parentObj.registersHL = parentObj.registersHL & 65408 | (parentObj.registersHL & 255) >> 1;
        parentObj.FHalfCarry = parentObj.FSubtract = false;
        parentObj.FZero = (parentObj.registersHL & 255) == 0;
    }),
    _wrap_(function (parentObj) {
        var temp_var = parentObj.memoryReader[parentObj.registersHL](parentObj, parentObj.registersHL);
        parentObj.FCarry = (temp_var & 1) == 1;
        temp_var = temp_var & 128 | temp_var >> 1;
        parentObj.memoryWriter[parentObj.registersHL](parentObj, parentObj.registersHL, temp_var);
        parentObj.FHalfCarry = parentObj.FSubtract = false;
        parentObj.FZero = temp_var == 0;
    }),
    _wrap_(function (parentObj) {
        parentObj.FCarry = (parentObj.registerA & 1) == 1;
        parentObj.registerA = parentObj.registerA & 128 | parentObj.registerA >> 1;
        parentObj.FHalfCarry = parentObj.FSubtract = false;
        parentObj.FZero = parentObj.registerA == 0;
    }),
    _wrap_(function (parentObj) {
        parentObj.registerB = (parentObj.registerB & 15) << 4 | parentObj.registerB >> 4;
        parentObj.FZero = parentObj.registerB == 0;
        parentObj.FCarry = parentObj.FHalfCarry = parentObj.FSubtract = false;
    }),
    _wrap_(function (parentObj) {
        parentObj.registerC = (parentObj.registerC & 15) << 4 | parentObj.registerC >> 4;
        parentObj.FZero = parentObj.registerC == 0;
        parentObj.FCarry = parentObj.FHalfCarry = parentObj.FSubtract = false;
    }),
    _wrap_(function (parentObj) {
        parentObj.registerD = (parentObj.registerD & 15) << 4 | parentObj.registerD >> 4;
        parentObj.FZero = parentObj.registerD == 0;
        parentObj.FCarry = parentObj.FHalfCarry = parentObj.FSubtract = false;
    }),
    _wrap_(function (parentObj) {
        parentObj.registerE = (parentObj.registerE & 15) << 4 | parentObj.registerE >> 4;
        parentObj.FZero = parentObj.registerE == 0;
        parentObj.FCarry = parentObj.FHalfCarry = parentObj.FSubtract = false;
    }),
    _wrap_(function (parentObj) {
        parentObj.registersHL = (parentObj.registersHL & 3840) << 4 | (parentObj.registersHL & 61440) >> 4 | parentObj.registersHL & 255;
        parentObj.FZero = parentObj.registersHL < 256;
        parentObj.FCarry = parentObj.FHalfCarry = parentObj.FSubtract = false;
    }),
    _wrap_(function (parentObj) {
        parentObj.registersHL = parentObj.registersHL & 65280 | (parentObj.registersHL & 15) << 4 | (parentObj.registersHL & 240) >> 4;
        parentObj.FZero = (parentObj.registersHL & 255) == 0;
        parentObj.FCarry = parentObj.FHalfCarry = parentObj.FSubtract = false;
    }),
    _wrap_(function (parentObj) {
        var temp_var = parentObj.memoryReader[parentObj.registersHL](parentObj, parentObj.registersHL);
        temp_var = (temp_var & 15) << 4 | temp_var >> 4;
        parentObj.memoryWriter[parentObj.registersHL](parentObj, parentObj.registersHL, temp_var);
        parentObj.FZero = temp_var == 0;
        parentObj.FCarry = parentObj.FHalfCarry = parentObj.FSubtract = false;
    }),
    _wrap_(function (parentObj) {
        parentObj.registerA = (parentObj.registerA & 15) << 4 | parentObj.registerA >> 4;
        parentObj.FZero = parentObj.registerA == 0;
        parentObj.FCarry = parentObj.FHalfCarry = parentObj.FSubtract = false;
    }),
    _wrap_(function (parentObj) {
        parentObj.FCarry = (parentObj.registerB & 1) == 1;
        parentObj.registerB >>= 1;
        parentObj.FHalfCarry = parentObj.FSubtract = false;
        parentObj.FZero = parentObj.registerB == 0;
    }),
    _wrap_(function (parentObj) {
        parentObj.FCarry = (parentObj.registerC & 1) == 1;
        parentObj.registerC >>= 1;
        parentObj.FHalfCarry = parentObj.FSubtract = false;
        parentObj.FZero = parentObj.registerC == 0;
    }),
    _wrap_(function (parentObj) {
        parentObj.FCarry = (parentObj.registerD & 1) == 1;
        parentObj.registerD >>= 1;
        parentObj.FHalfCarry = parentObj.FSubtract = false;
        parentObj.FZero = parentObj.registerD == 0;
    }),
    _wrap_(function (parentObj) {
        parentObj.FCarry = (parentObj.registerE & 1) == 1;
        parentObj.registerE >>= 1;
        parentObj.FHalfCarry = parentObj.FSubtract = false;
        parentObj.FZero = parentObj.registerE == 0;
    }),
    _wrap_(function (parentObj) {
        parentObj.FCarry = (parentObj.registersHL & 256) == 256;
        parentObj.registersHL = parentObj.registersHL >> 1 & 65280 | parentObj.registersHL & 255;
        parentObj.FHalfCarry = parentObj.FSubtract = false;
        parentObj.FZero = parentObj.registersHL < 256;
    }),
    _wrap_(function (parentObj) {
        parentObj.FCarry = (parentObj.registersHL & 1) == 1;
        parentObj.registersHL = parentObj.registersHL & 65280 | (parentObj.registersHL & 255) >> 1;
        parentObj.FHalfCarry = parentObj.FSubtract = false;
        parentObj.FZero = (parentObj.registersHL & 255) == 0;
    }),
    _wrap_(function (parentObj) {
        var temp_var = parentObj.memoryReader[parentObj.registersHL](parentObj, parentObj.registersHL);
        parentObj.FCarry = (temp_var & 1) == 1;
        parentObj.memoryWriter[parentObj.registersHL](parentObj, parentObj.registersHL, temp_var >> 1);
        parentObj.FHalfCarry = parentObj.FSubtract = false;
        parentObj.FZero = temp_var < 2;
    }),
    _wrap_(function (parentObj) {
        parentObj.FCarry = (parentObj.registerA & 1) == 1;
        parentObj.registerA >>= 1;
        parentObj.FHalfCarry = parentObj.FSubtract = false;
        parentObj.FZero = parentObj.registerA == 0;
    }),
    _wrap_(function (parentObj) {
        parentObj.FHalfCarry = true;
        parentObj.FSubtract = false;
        parentObj.FZero = (parentObj.registerB & 1) == 0;
    }),
    _wrap_(function (parentObj) {
        parentObj.FHalfCarry = true;
        parentObj.FSubtract = false;
        parentObj.FZero = (parentObj.registerC & 1) == 0;
    }),
    _wrap_(function (parentObj) {
        parentObj.FHalfCarry = true;
        parentObj.FSubtract = false;
        parentObj.FZero = (parentObj.registerD & 1) == 0;
    }),
    _wrap_(function (parentObj) {
        parentObj.FHalfCarry = true;
        parentObj.FSubtract = false;
        parentObj.FZero = (parentObj.registerE & 1) == 0;
    }),
    _wrap_(function (parentObj) {
        parentObj.FHalfCarry = true;
        parentObj.FSubtract = false;
        parentObj.FZero = (parentObj.registersHL & 256) == 0;
    }),
    _wrap_(function (parentObj) {
        parentObj.FHalfCarry = true;
        parentObj.FSubtract = false;
        parentObj.FZero = (parentObj.registersHL & 1) == 0;
    }),
    _wrap_(function (parentObj) {
        parentObj.FHalfCarry = true;
        parentObj.FSubtract = false;
        parentObj.FZero = (parentObj.memoryReader[parentObj.registersHL](parentObj, parentObj.registersHL) & 1) == 0;
    }),
    _wrap_(function (parentObj) {
        parentObj.FHalfCarry = true;
        parentObj.FSubtract = false;
        parentObj.FZero = (parentObj.registerA & 1) == 0;
    }),
    _wrap_(function (parentObj) {
        parentObj.FHalfCarry = true;
        parentObj.FSubtract = false;
        parentObj.FZero = (parentObj.registerB & 2) == 0;
    }),
    _wrap_(function (parentObj) {
        parentObj.FHalfCarry = true;
        parentObj.FSubtract = false;
        parentObj.FZero = (parentObj.registerC & 2) == 0;
    }),
    _wrap_(function (parentObj) {
        parentObj.FHalfCarry = true;
        parentObj.FSubtract = false;
        parentObj.FZero = (parentObj.registerD & 2) == 0;
    }),
    _wrap_(function (parentObj) {
        parentObj.FHalfCarry = true;
        parentObj.FSubtract = false;
        parentObj.FZero = (parentObj.registerE & 2) == 0;
    }),
    _wrap_(function (parentObj) {
        parentObj.FHalfCarry = true;
        parentObj.FSubtract = false;
        parentObj.FZero = (parentObj.registersHL & 512) == 0;
    }),
    _wrap_(function (parentObj) {
        parentObj.FHalfCarry = true;
        parentObj.FSubtract = false;
        parentObj.FZero = (parentObj.registersHL & 2) == 0;
    }),
    _wrap_(function (parentObj) {
        parentObj.FHalfCarry = true;
        parentObj.FSubtract = false;
        parentObj.FZero = (parentObj.memoryReader[parentObj.registersHL](parentObj, parentObj.registersHL) & 2) == 0;
    }),
    _wrap_(function (parentObj) {
        parentObj.FHalfCarry = true;
        parentObj.FSubtract = false;
        parentObj.FZero = (parentObj.registerA & 2) == 0;
    }),
    _wrap_(function (parentObj) {
        parentObj.FHalfCarry = true;
        parentObj.FSubtract = false;
        parentObj.FZero = (parentObj.registerB & 4) == 0;
    }),
    _wrap_(function (parentObj) {
        parentObj.FHalfCarry = true;
        parentObj.FSubtract = false;
        parentObj.FZero = (parentObj.registerC & 4) == 0;
    }),
    _wrap_(function (parentObj) {
        parentObj.FHalfCarry = true;
        parentObj.FSubtract = false;
        parentObj.FZero = (parentObj.registerD & 4) == 0;
    }),
    _wrap_(function (parentObj) {
        parentObj.FHalfCarry = true;
        parentObj.FSubtract = false;
        parentObj.FZero = (parentObj.registerE & 4) == 0;
    }),
    _wrap_(function (parentObj) {
        parentObj.FHalfCarry = true;
        parentObj.FSubtract = false;
        parentObj.FZero = (parentObj.registersHL & 1024) == 0;
    }),
    _wrap_(function (parentObj) {
        parentObj.FHalfCarry = true;
        parentObj.FSubtract = false;
        parentObj.FZero = (parentObj.registersHL & 4) == 0;
    }),
    _wrap_(function (parentObj) {
        parentObj.FHalfCarry = true;
        parentObj.FSubtract = false;
        parentObj.FZero = (parentObj.memoryReader[parentObj.registersHL](parentObj, parentObj.registersHL) & 4) == 0;
    }),
    _wrap_(function (parentObj) {
        parentObj.FHalfCarry = true;
        parentObj.FSubtract = false;
        parentObj.FZero = (parentObj.registerA & 4) == 0;
    }),
    _wrap_(function (parentObj) {
        parentObj.FHalfCarry = true;
        parentObj.FSubtract = false;
        parentObj.FZero = (parentObj.registerB & 8) == 0;
    }),
    _wrap_(function (parentObj) {
        parentObj.FHalfCarry = true;
        parentObj.FSubtract = false;
        parentObj.FZero = (parentObj.registerC & 8) == 0;
    }),
    _wrap_(function (parentObj) {
        parentObj.FHalfCarry = true;
        parentObj.FSubtract = false;
        parentObj.FZero = (parentObj.registerD & 8) == 0;
    }),
    _wrap_(function (parentObj) {
        parentObj.FHalfCarry = true;
        parentObj.FSubtract = false;
        parentObj.FZero = (parentObj.registerE & 8) == 0;
    }),
    _wrap_(function (parentObj) {
        parentObj.FHalfCarry = true;
        parentObj.FSubtract = false;
        parentObj.FZero = (parentObj.registersHL & 2048) == 0;
    }),
    _wrap_(function (parentObj) {
        parentObj.FHalfCarry = true;
        parentObj.FSubtract = false;
        parentObj.FZero = (parentObj.registersHL & 8) == 0;
    }),
    _wrap_(function (parentObj) {
        parentObj.FHalfCarry = true;
        parentObj.FSubtract = false;
        parentObj.FZero = (parentObj.memoryReader[parentObj.registersHL](parentObj, parentObj.registersHL) & 8) == 0;
    }),
    _wrap_(function (parentObj) {
        parentObj.FHalfCarry = true;
        parentObj.FSubtract = false;
        parentObj.FZero = (parentObj.registerA & 8) == 0;
    }),
    _wrap_(function (parentObj) {
        parentObj.FHalfCarry = true;
        parentObj.FSubtract = false;
        parentObj.FZero = (parentObj.registerB & 16) == 0;
    }),
    _wrap_(function (parentObj) {
        parentObj.FHalfCarry = true;
        parentObj.FSubtract = false;
        parentObj.FZero = (parentObj.registerC & 16) == 0;
    }),
    _wrap_(function (parentObj) {
        parentObj.FHalfCarry = true;
        parentObj.FSubtract = false;
        parentObj.FZero = (parentObj.registerD & 16) == 0;
    }),
    _wrap_(function (parentObj) {
        parentObj.FHalfCarry = true;
        parentObj.FSubtract = false;
        parentObj.FZero = (parentObj.registerE & 16) == 0;
    }),
    _wrap_(function (parentObj) {
        parentObj.FHalfCarry = true;
        parentObj.FSubtract = false;
        parentObj.FZero = (parentObj.registersHL & 4096) == 0;
    }),
    _wrap_(function (parentObj) {
        parentObj.FHalfCarry = true;
        parentObj.FSubtract = false;
        parentObj.FZero = (parentObj.registersHL & 16) == 0;
    }),
    _wrap_(function (parentObj) {
        parentObj.FHalfCarry = true;
        parentObj.FSubtract = false;
        parentObj.FZero = (parentObj.memoryReader[parentObj.registersHL](parentObj, parentObj.registersHL) & 16) == 0;
    }),
    _wrap_(function (parentObj) {
        parentObj.FHalfCarry = true;
        parentObj.FSubtract = false;
        parentObj.FZero = (parentObj.registerA & 16) == 0;
    }),
    _wrap_(function (parentObj) {
        parentObj.FHalfCarry = true;
        parentObj.FSubtract = false;
        parentObj.FZero = (parentObj.registerB & 32) == 0;
    }),
    _wrap_(function (parentObj) {
        parentObj.FHalfCarry = true;
        parentObj.FSubtract = false;
        parentObj.FZero = (parentObj.registerC & 32) == 0;
    }),
    _wrap_(function (parentObj) {
        parentObj.FHalfCarry = true;
        parentObj.FSubtract = false;
        parentObj.FZero = (parentObj.registerD & 32) == 0;
    }),
    _wrap_(function (parentObj) {
        parentObj.FHalfCarry = true;
        parentObj.FSubtract = false;
        parentObj.FZero = (parentObj.registerE & 32) == 0;
    }),
    _wrap_(function (parentObj) {
        parentObj.FHalfCarry = true;
        parentObj.FSubtract = false;
        parentObj.FZero = (parentObj.registersHL & 8192) == 0;
    }),
    _wrap_(function (parentObj) {
        parentObj.FHalfCarry = true;
        parentObj.FSubtract = false;
        parentObj.FZero = (parentObj.registersHL & 32) == 0;
    }),
    _wrap_(function (parentObj) {
        parentObj.FHalfCarry = true;
        parentObj.FSubtract = false;
        parentObj.FZero = (parentObj.memoryReader[parentObj.registersHL](parentObj, parentObj.registersHL) & 32) == 0;
    }),
    _wrap_(function (parentObj) {
        parentObj.FHalfCarry = true;
        parentObj.FSubtract = false;
        parentObj.FZero = (parentObj.registerA & 32) == 0;
    }),
    _wrap_(function (parentObj) {
        parentObj.FHalfCarry = true;
        parentObj.FSubtract = false;
        parentObj.FZero = (parentObj.registerB & 64) == 0;
    }),
    _wrap_(function (parentObj) {
        parentObj.FHalfCarry = true;
        parentObj.FSubtract = false;
        parentObj.FZero = (parentObj.registerC & 64) == 0;
    }),
    _wrap_(function (parentObj) {
        parentObj.FHalfCarry = true;
        parentObj.FSubtract = false;
        parentObj.FZero = (parentObj.registerD & 64) == 0;
    }),
    _wrap_(function (parentObj) {
        parentObj.FHalfCarry = true;
        parentObj.FSubtract = false;
        parentObj.FZero = (parentObj.registerE & 64) == 0;
    }),
    _wrap_(function (parentObj) {
        parentObj.FHalfCarry = true;
        parentObj.FSubtract = false;
        parentObj.FZero = (parentObj.registersHL & 16384) == 0;
    }),
    _wrap_(function (parentObj) {
        parentObj.FHalfCarry = true;
        parentObj.FSubtract = false;
        parentObj.FZero = (parentObj.registersHL & 64) == 0;
    }),
    _wrap_(function (parentObj) {
        parentObj.FHalfCarry = true;
        parentObj.FSubtract = false;
        parentObj.FZero = (parentObj.memoryReader[parentObj.registersHL](parentObj, parentObj.registersHL) & 64) == 0;
    }),
    _wrap_(function (parentObj) {
        parentObj.FHalfCarry = true;
        parentObj.FSubtract = false;
        parentObj.FZero = (parentObj.registerA & 64) == 0;
    }),
    _wrap_(function (parentObj) {
        parentObj.FHalfCarry = true;
        parentObj.FSubtract = false;
        parentObj.FZero = (parentObj.registerB & 128) == 0;
    }),
    _wrap_(function (parentObj) {
        parentObj.FHalfCarry = true;
        parentObj.FSubtract = false;
        parentObj.FZero = (parentObj.registerC & 128) == 0;
    }),
    _wrap_(function (parentObj) {
        parentObj.FHalfCarry = true;
        parentObj.FSubtract = false;
        parentObj.FZero = (parentObj.registerD & 128) == 0;
    }),
    _wrap_(function (parentObj) {
        parentObj.FHalfCarry = true;
        parentObj.FSubtract = false;
        parentObj.FZero = (parentObj.registerE & 128) == 0;
    }),
    _wrap_(function (parentObj) {
        parentObj.FHalfCarry = true;
        parentObj.FSubtract = false;
        parentObj.FZero = (parentObj.registersHL & 32768) == 0;
    }),
    _wrap_(function (parentObj) {
        parentObj.FHalfCarry = true;
        parentObj.FSubtract = false;
        parentObj.FZero = (parentObj.registersHL & 128) == 0;
    }),
    _wrap_(function (parentObj) {
        parentObj.FHalfCarry = true;
        parentObj.FSubtract = false;
        parentObj.FZero = (parentObj.memoryReader[parentObj.registersHL](parentObj, parentObj.registersHL) & 128) == 0;
    }),
    _wrap_(function (parentObj) {
        parentObj.FHalfCarry = true;
        parentObj.FSubtract = false;
        parentObj.FZero = (parentObj.registerA & 128) == 0;
    }),
    _wrap_(function (parentObj) {
        parentObj.registerB &= 254;
    }),
    _wrap_(function (parentObj) {
        parentObj.registerC &= 254;
    }),
    _wrap_(function (parentObj) {
        parentObj.registerD &= 254;
    }),
    _wrap_(function (parentObj) {
        parentObj.registerE &= 254;
    }),
    _wrap_(function (parentObj) {
        parentObj.registersHL &= 65279;
    }),
    _wrap_(function (parentObj) {
        parentObj.registersHL &= 65534;
    }),
    _wrap_(function (parentObj) {
        parentObj.memoryWriter[parentObj.registersHL](parentObj, parentObj.registersHL, parentObj.memoryReader[parentObj.registersHL](parentObj, parentObj.registersHL) & 254);
    }),
    _wrap_(function (parentObj) {
        parentObj.registerA &= 254;
    }),
    _wrap_(function (parentObj) {
        parentObj.registerB &= 253;
    }),
    _wrap_(function (parentObj) {
        parentObj.registerC &= 253;
    }),
    _wrap_(function (parentObj) {
        parentObj.registerD &= 253;
    }),
    _wrap_(function (parentObj) {
        parentObj.registerE &= 253;
    }),
    _wrap_(function (parentObj) {
        parentObj.registersHL &= 65023;
    }),
    _wrap_(function (parentObj) {
        parentObj.registersHL &= 65533;
    }),
    _wrap_(function (parentObj) {
        parentObj.memoryWriter[parentObj.registersHL](parentObj, parentObj.registersHL, parentObj.memoryReader[parentObj.registersHL](parentObj, parentObj.registersHL) & 253);
    }),
    _wrap_(function (parentObj) {
        parentObj.registerA &= 253;
    }),
    _wrap_(function (parentObj) {
        parentObj.registerB &= 251;
    }),
    _wrap_(function (parentObj) {
        parentObj.registerC &= 251;
    }),
    _wrap_(function (parentObj) {
        parentObj.registerD &= 251;
    }),
    _wrap_(function (parentObj) {
        parentObj.registerE &= 251;
    }),
    _wrap_(function (parentObj) {
        parentObj.registersHL &= 64511;
    }),
    _wrap_(function (parentObj) {
        parentObj.registersHL &= 65531;
    }),
    _wrap_(function (parentObj) {
        parentObj.memoryWriter[parentObj.registersHL](parentObj, parentObj.registersHL, parentObj.memoryReader[parentObj.registersHL](parentObj, parentObj.registersHL) & 251);
    }),
    _wrap_(function (parentObj) {
        parentObj.registerA &= 251;
    }),
    _wrap_(function (parentObj) {
        parentObj.registerB &= 247;
    }),
    _wrap_(function (parentObj) {
        parentObj.registerC &= 247;
    }),
    _wrap_(function (parentObj) {
        parentObj.registerD &= 247;
    }),
    _wrap_(function (parentObj) {
        parentObj.registerE &= 247;
    }),
    _wrap_(function (parentObj) {
        parentObj.registersHL &= 63487;
    }),
    _wrap_(function (parentObj) {
        parentObj.registersHL &= 65527;
    }),
    _wrap_(function (parentObj) {
        parentObj.memoryWriter[parentObj.registersHL](parentObj, parentObj.registersHL, parentObj.memoryReader[parentObj.registersHL](parentObj, parentObj.registersHL) & 247);
    }),
    _wrap_(function (parentObj) {
        parentObj.registerA &= 247;
    }),
    _wrap_(function (parentObj) {
        parentObj.registerB &= 239;
    }),
    _wrap_(function (parentObj) {
        parentObj.registerC &= 239;
    }),
    _wrap_(function (parentObj) {
        parentObj.registerD &= 239;
    }),
    _wrap_(function (parentObj) {
        parentObj.registerE &= 239;
    }),
    _wrap_(function (parentObj) {
        parentObj.registersHL &= 61439;
    }),
    _wrap_(function (parentObj) {
        parentObj.registersHL &= 65519;
    }),
    _wrap_(function (parentObj) {
        parentObj.memoryWriter[parentObj.registersHL](parentObj, parentObj.registersHL, parentObj.memoryReader[parentObj.registersHL](parentObj, parentObj.registersHL) & 239);
    }),
    _wrap_(function (parentObj) {
        parentObj.registerA &= 239;
    }),
    _wrap_(function (parentObj) {
        parentObj.registerB &= 223;
    }),
    _wrap_(function (parentObj) {
        parentObj.registerC &= 223;
    }),
    _wrap_(function (parentObj) {
        parentObj.registerD &= 223;
    }),
    _wrap_(function (parentObj) {
        parentObj.registerE &= 223;
    }),
    _wrap_(function (parentObj) {
        parentObj.registersHL &= 57343;
    }),
    _wrap_(function (parentObj) {
        parentObj.registersHL &= 65503;
    }),
    _wrap_(function (parentObj) {
        parentObj.memoryWriter[parentObj.registersHL](parentObj, parentObj.registersHL, parentObj.memoryReader[parentObj.registersHL](parentObj, parentObj.registersHL) & 223);
    }),
    _wrap_(function (parentObj) {
        parentObj.registerA &= 223;
    }),
    _wrap_(function (parentObj) {
        parentObj.registerB &= 191;
    }),
    _wrap_(function (parentObj) {
        parentObj.registerC &= 191;
    }),
    _wrap_(function (parentObj) {
        parentObj.registerD &= 191;
    }),
    _wrap_(function (parentObj) {
        parentObj.registerE &= 191;
    }),
    _wrap_(function (parentObj) {
        parentObj.registersHL &= 49151;
    }),
    _wrap_(function (parentObj) {
        parentObj.registersHL &= 65471;
    }),
    _wrap_(function (parentObj) {
        parentObj.memoryWriter[parentObj.registersHL](parentObj, parentObj.registersHL, parentObj.memoryReader[parentObj.registersHL](parentObj, parentObj.registersHL) & 191);
    }),
    _wrap_(function (parentObj) {
        parentObj.registerA &= 191;
    }),
    _wrap_(function (parentObj) {
        parentObj.registerB &= 127;
    }),
    _wrap_(function (parentObj) {
        parentObj.registerC &= 127;
    }),
    _wrap_(function (parentObj) {
        parentObj.registerD &= 127;
    }),
    _wrap_(function (parentObj) {
        parentObj.registerE &= 127;
    }),
    _wrap_(function (parentObj) {
        parentObj.registersHL &= 32767;
    }),
    _wrap_(function (parentObj) {
        parentObj.registersHL &= 65407;
    }),
    _wrap_(function (parentObj) {
        parentObj.memoryWriter[parentObj.registersHL](parentObj, parentObj.registersHL, parentObj.memoryReader[parentObj.registersHL](parentObj, parentObj.registersHL) & 127);
    }),
    _wrap_(function (parentObj) {
        parentObj.registerA &= 127;
    }),
    _wrap_(function (parentObj) {
        parentObj.registerB |= 1;
    }),
    _wrap_(function (parentObj) {
        parentObj.registerC |= 1;
    }),
    _wrap_(function (parentObj) {
        parentObj.registerD |= 1;
    }),
    _wrap_(function (parentObj) {
        parentObj.registerE |= 1;
    }),
    _wrap_(function (parentObj) {
        parentObj.registersHL |= 256;
    }),
    _wrap_(function (parentObj) {
        parentObj.registersHL |= 1;
    }),
    _wrap_(function (parentObj) {
        parentObj.memoryWriter[parentObj.registersHL](parentObj, parentObj.registersHL, parentObj.memoryReader[parentObj.registersHL](parentObj, parentObj.registersHL) | 1);
    }),
    _wrap_(function (parentObj) {
        parentObj.registerA |= 1;
    }),
    _wrap_(function (parentObj) {
        parentObj.registerB |= 2;
    }),
    _wrap_(function (parentObj) {
        parentObj.registerC |= 2;
    }),
    _wrap_(function (parentObj) {
        parentObj.registerD |= 2;
    }),
    _wrap_(function (parentObj) {
        parentObj.registerE |= 2;
    }),
    _wrap_(function (parentObj) {
        parentObj.registersHL |= 512;
    }),
    _wrap_(function (parentObj) {
        parentObj.registersHL |= 2;
    }),
    _wrap_(function (parentObj) {
        parentObj.memoryWriter[parentObj.registersHL](parentObj, parentObj.registersHL, parentObj.memoryReader[parentObj.registersHL](parentObj, parentObj.registersHL) | 2);
    }),
    _wrap_(function (parentObj) {
        parentObj.registerA |= 2;
    }),
    _wrap_(function (parentObj) {
        parentObj.registerB |= 4;
    }),
    _wrap_(function (parentObj) {
        parentObj.registerC |= 4;
    }),
    _wrap_(function (parentObj) {
        parentObj.registerD |= 4;
    }),
    _wrap_(function (parentObj) {
        parentObj.registerE |= 4;
    }),
    _wrap_(function (parentObj) {
        parentObj.registersHL |= 1024;
    }),
    _wrap_(function (parentObj) {
        parentObj.registersHL |= 4;
    }),
    _wrap_(function (parentObj) {
        parentObj.memoryWriter[parentObj.registersHL](parentObj, parentObj.registersHL, parentObj.memoryReader[parentObj.registersHL](parentObj, parentObj.registersHL) | 4);
    }),
    _wrap_(function (parentObj) {
        parentObj.registerA |= 4;
    }),
    _wrap_(function (parentObj) {
        parentObj.registerB |= 8;
    }),
    _wrap_(function (parentObj) {
        parentObj.registerC |= 8;
    }),
    _wrap_(function (parentObj) {
        parentObj.registerD |= 8;
    }),
    _wrap_(function (parentObj) {
        parentObj.registerE |= 8;
    }),
    _wrap_(function (parentObj) {
        parentObj.registersHL |= 2048;
    }),
    _wrap_(function (parentObj) {
        parentObj.registersHL |= 8;
    }),
    _wrap_(function (parentObj) {
        parentObj.memoryWriter[parentObj.registersHL](parentObj, parentObj.registersHL, parentObj.memoryReader[parentObj.registersHL](parentObj, parentObj.registersHL) | 8);
    }),
    _wrap_(function (parentObj) {
        parentObj.registerA |= 8;
    }),
    _wrap_(function (parentObj) {
        parentObj.registerB |= 16;
    }),
    _wrap_(function (parentObj) {
        parentObj.registerC |= 16;
    }),
    _wrap_(function (parentObj) {
        parentObj.registerD |= 16;
    }),
    _wrap_(function (parentObj) {
        parentObj.registerE |= 16;
    }),
    _wrap_(function (parentObj) {
        parentObj.registersHL |= 4096;
    }),
    _wrap_(function (parentObj) {
        parentObj.registersHL |= 16;
    }),
    _wrap_(function (parentObj) {
        parentObj.memoryWriter[parentObj.registersHL](parentObj, parentObj.registersHL, parentObj.memoryReader[parentObj.registersHL](parentObj, parentObj.registersHL) | 16);
    }),
    _wrap_(function (parentObj) {
        parentObj.registerA |= 16;
    }),
    _wrap_(function (parentObj) {
        parentObj.registerB |= 32;
    }),
    _wrap_(function (parentObj) {
        parentObj.registerC |= 32;
    }),
    _wrap_(function (parentObj) {
        parentObj.registerD |= 32;
    }),
    _wrap_(function (parentObj) {
        parentObj.registerE |= 32;
    }),
    _wrap_(function (parentObj) {
        parentObj.registersHL |= 8192;
    }),
    _wrap_(function (parentObj) {
        parentObj.registersHL |= 32;
    }),
    _wrap_(function (parentObj) {
        parentObj.memoryWriter[parentObj.registersHL](parentObj, parentObj.registersHL, parentObj.memoryReader[parentObj.registersHL](parentObj, parentObj.registersHL) | 32);
    }),
    _wrap_(function (parentObj) {
        parentObj.registerA |= 32;
    }),
    _wrap_(function (parentObj) {
        parentObj.registerB |= 64;
    }),
    _wrap_(function (parentObj) {
        parentObj.registerC |= 64;
    }),
    _wrap_(function (parentObj) {
        parentObj.registerD |= 64;
    }),
    _wrap_(function (parentObj) {
        parentObj.registerE |= 64;
    }),
    _wrap_(function (parentObj) {
        parentObj.registersHL |= 16384;
    }),
    _wrap_(function (parentObj) {
        parentObj.registersHL |= 64;
    }),
    _wrap_(function (parentObj) {
        parentObj.memoryWriter[parentObj.registersHL](parentObj, parentObj.registersHL, parentObj.memoryReader[parentObj.registersHL](parentObj, parentObj.registersHL) | 64);
    }),
    _wrap_(function (parentObj) {
        parentObj.registerA |= 64;
    }),
    _wrap_(function (parentObj) {
        parentObj.registerB |= 128;
    }),
    _wrap_(function (parentObj) {
        parentObj.registerC |= 128;
    }),
    _wrap_(function (parentObj) {
        parentObj.registerD |= 128;
    }),
    _wrap_(function (parentObj) {
        parentObj.registerE |= 128;
    }),
    _wrap_(function (parentObj) {
        parentObj.registersHL |= 32768;
    }),
    _wrap_(function (parentObj) {
        parentObj.registersHL |= 128;
    }),
    _wrap_(function (parentObj) {
        parentObj.memoryWriter[parentObj.registersHL](parentObj, parentObj.registersHL, parentObj.memoryReader[parentObj.registersHL](parentObj, parentObj.registersHL) | 128);
    }),
    _wrap_(function (parentObj) {
        parentObj.registerA |= 128;
    })
];
GameBoyCore.prototype.TICKTable = [
    4,
    12,
    8,
    8,
    4,
    4,
    8,
    4,
    20,
    8,
    8,
    8,
    4,
    4,
    8,
    4,
    4,
    12,
    8,
    8,
    4,
    4,
    8,
    4,
    12,
    8,
    8,
    8,
    4,
    4,
    8,
    4,
    8,
    12,
    8,
    8,
    4,
    4,
    8,
    4,
    8,
    8,
    8,
    8,
    4,
    4,
    8,
    4,
    8,
    12,
    8,
    8,
    12,
    12,
    12,
    4,
    8,
    8,
    8,
    8,
    4,
    4,
    8,
    4,
    4,
    4,
    4,
    4,
    4,
    4,
    8,
    4,
    4,
    4,
    4,
    4,
    4,
    4,
    8,
    4,
    4,
    4,
    4,
    4,
    4,
    4,
    8,
    4,
    4,
    4,
    4,
    4,
    4,
    4,
    8,
    4,
    4,
    4,
    4,
    4,
    4,
    4,
    8,
    4,
    4,
    4,
    4,
    4,
    4,
    4,
    8,
    4,
    8,
    8,
    8,
    8,
    8,
    8,
    4,
    8,
    4,
    4,
    4,
    4,
    4,
    4,
    8,
    4,
    4,
    4,
    4,
    4,
    4,
    4,
    8,
    4,
    4,
    4,
    4,
    4,
    4,
    4,
    8,
    4,
    4,
    4,
    4,
    4,
    4,
    4,
    8,
    4,
    4,
    4,
    4,
    4,
    4,
    4,
    8,
    4,
    4,
    4,
    4,
    4,
    4,
    4,
    8,
    4,
    4,
    4,
    4,
    4,
    4,
    4,
    8,
    4,
    4,
    4,
    4,
    4,
    4,
    4,
    8,
    4,
    4,
    4,
    4,
    4,
    4,
    4,
    8,
    4,
    8,
    12,
    12,
    16,
    12,
    16,
    8,
    16,
    8,
    16,
    12,
    0,
    12,
    24,
    8,
    16,
    8,
    12,
    12,
    4,
    12,
    16,
    8,
    16,
    8,
    16,
    12,
    4,
    12,
    4,
    8,
    16,
    12,
    12,
    8,
    4,
    4,
    16,
    8,
    16,
    16,
    4,
    16,
    4,
    4,
    4,
    8,
    16,
    12,
    12,
    8,
    4,
    4,
    16,
    8,
    16,
    12,
    8,
    16,
    4,
    0,
    4,
    8,
    16
];
GameBoyCore.prototype.SecondaryTICKTable = [
    8,
    8,
    8,
    8,
    8,
    8,
    16,
    8,
    8,
    8,
    8,
    8,
    8,
    8,
    16,
    8,
    8,
    8,
    8,
    8,
    8,
    8,
    16,
    8,
    8,
    8,
    8,
    8,
    8,
    8,
    16,
    8,
    8,
    8,
    8,
    8,
    8,
    8,
    16,
    8,
    8,
    8,
    8,
    8,
    8,
    8,
    16,
    8,
    8,
    8,
    8,
    8,
    8,
    8,
    16,
    8,
    8,
    8,
    8,
    8,
    8,
    8,
    16,
    8,
    8,
    8,
    8,
    8,
    8,
    8,
    12,
    8,
    8,
    8,
    8,
    8,
    8,
    8,
    12,
    8,
    8,
    8,
    8,
    8,
    8,
    8,
    12,
    8,
    8,
    8,
    8,
    8,
    8,
    8,
    12,
    8,
    8,
    8,
    8,
    8,
    8,
    8,
    12,
    8,
    8,
    8,
    8,
    8,
    8,
    8,
    12,
    8,
    8,
    8,
    8,
    8,
    8,
    8,
    12,
    8,
    8,
    8,
    8,
    8,
    8,
    8,
    12,
    8,
    8,
    8,
    8,
    8,
    8,
    8,
    16,
    8,
    8,
    8,
    8,
    8,
    8,
    8,
    16,
    8,
    8,
    8,
    8,
    8,
    8,
    8,
    16,
    8,
    8,
    8,
    8,
    8,
    8,
    8,
    16,
    8,
    8,
    8,
    8,
    8,
    8,
    8,
    16,
    8,
    8,
    8,
    8,
    8,
    8,
    8,
    16,
    8,
    8,
    8,
    8,
    8,
    8,
    8,
    16,
    8,
    8,
    8,
    8,
    8,
    8,
    8,
    16,
    8,
    8,
    8,
    8,
    8,
    8,
    8,
    16,
    8,
    8,
    8,
    8,
    8,
    8,
    8,
    16,
    8,
    8,
    8,
    8,
    8,
    8,
    8,
    16,
    8,
    8,
    8,
    8,
    8,
    8,
    8,
    16,
    8,
    8,
    8,
    8,
    8,
    8,
    8,
    16,
    8,
    8,
    8,
    8,
    8,
    8,
    8,
    16,
    8,
    8,
    8,
    8,
    8,
    8,
    8,
    16,
    8,
    8,
    8,
    8,
    8,
    8,
    8,
    16,
    8
];
GameBoyCore.prototype.saveSRAMState = _wrap_(function () {
    if (!this.cBATT || this.MBCRam.length == 0) {
        return [];
    } else {
        return this.fromTypedArray(this.MBCRam);
    }
});
GameBoyCore.prototype.saveRTCState = _wrap_(function () {
    if (!this.cTIMER) {
        return [];
    } else {
        return [
            this.lastIteration,
            this.RTCisLatched,
            this.latchedSeconds,
            this.latchedMinutes,
            this.latchedHours,
            this.latchedLDays,
            this.latchedHDays,
            this.RTCSeconds,
            this.RTCMinutes,
            this.RTCHours,
            this.RTCDays,
            this.RTCDayOverFlow,
            this.RTCHALT
        ];
    }
});
GameBoyCore.prototype.saveState = _wrap_(function () {
    return [
        this.fromTypedArray(this.ROM),
        this.inBootstrap,
        this.registerA,
        this.FZero,
        this.FSubtract,
        this.FHalfCarry,
        this.FCarry,
        this.registerB,
        this.registerC,
        this.registerD,
        this.registerE,
        this.registersHL,
        this.stackPointer,
        this.programCounter,
        this.halt,
        this.IME,
        this.hdmaRunning,
        this.CPUTicks,
        this.doubleSpeedShifter,
        this.fromTypedArray(this.memory),
        this.fromTypedArray(this.MBCRam),
        this.fromTypedArray(this.VRAM),
        this.currVRAMBank,
        this.fromTypedArray(this.GBCMemory),
        this.MBC1Mode,
        this.MBCRAMBanksEnabled,
        this.currMBCRAMBank,
        this.currMBCRAMBankPosition,
        this.cGBC,
        this.gbcRamBank,
        this.gbcRamBankPosition,
        this.ROMBank1offs,
        this.currentROMBank,
        this.cartridgeType,
        this.name,
        this.gameCode,
        this.modeSTAT,
        this.LYCMatchTriggerSTAT,
        this.mode2TriggerSTAT,
        this.mode1TriggerSTAT,
        this.mode0TriggerSTAT,
        this.LCDisOn,
        this.gfxWindowCHRBankPosition,
        this.gfxWindowDisplay,
        this.gfxSpriteShow,
        this.gfxSpriteNormalHeight,
        this.gfxBackgroundCHRBankPosition,
        this.gfxBackgroundBankOffset,
        this.TIMAEnabled,
        this.DIVTicks,
        this.LCDTicks,
        this.timerTicks,
        this.TACClocker,
        this.serialTimer,
        this.serialShiftTimer,
        this.serialShiftTimerAllocated,
        this.IRQEnableDelay,
        this.lastIteration,
        this.cMBC1,
        this.cMBC2,
        this.cMBC3,
        this.cMBC5,
        this.cMBC7,
        this.cSRAM,
        this.cMMMO1,
        this.cRUMBLE,
        this.cCamera,
        this.cTAMA5,
        this.cHuC3,
        this.cHuC1,
        this.drewBlank,
        this.fromTypedArray(this.frameBuffer),
        this.bgEnabled,
        this.BGPriorityEnabled,
        this.channel1FrequencyTracker,
        this.channel1FrequencyCounter,
        this.channel1totalLength,
        this.channel1envelopeVolume,
        this.channel1envelopeType,
        this.channel1envelopeSweeps,
        this.channel1envelopeSweepsLast,
        this.channel1consecutive,
        this.channel1frequency,
        this.channel1SweepFault,
        this.channel1ShadowFrequency,
        this.channel1timeSweep,
        this.channel1lastTimeSweep,
        this.channel1numSweep,
        this.channel1frequencySweepDivider,
        this.channel1decreaseSweep,
        this.channel2FrequencyTracker,
        this.channel2FrequencyCounter,
        this.channel2totalLength,
        this.channel2envelopeVolume,
        this.channel2envelopeType,
        this.channel2envelopeSweeps,
        this.channel2envelopeSweepsLast,
        this.channel2consecutive,
        this.channel2frequency,
        this.channel3canPlay,
        this.channel3totalLength,
        this.channel3patternType,
        this.channel3frequency,
        this.channel3consecutive,
        this.fromTypedArray(this.channel3PCM),
        this.channel4FrequencyPeriod,
        this.channel4lastSampleLookup,
        this.channel4totalLength,
        this.channel4envelopeVolume,
        this.channel4currentVolume,
        this.channel4envelopeType,
        this.channel4envelopeSweeps,
        this.channel4envelopeSweepsLast,
        this.channel4consecutive,
        this.channel4BitRange,
        this.soundMasterEnabled,
        this.VinLeftChannelMasterVolume,
        this.VinRightChannelMasterVolume,
        this.leftChannel1,
        this.leftChannel2,
        this.leftChannel3,
        this.leftChannel4,
        this.rightChannel1,
        this.rightChannel2,
        this.rightChannel3,
        this.rightChannel4,
        this.channel1currentSampleLeft,
        this.channel1currentSampleRight,
        this.channel2currentSampleLeft,
        this.channel2currentSampleRight,
        this.channel3currentSampleLeft,
        this.channel3currentSampleRight,
        this.channel4currentSampleLeft,
        this.channel4currentSampleRight,
        this.channel1currentSampleLeftSecondary,
        this.channel1currentSampleRightSecondary,
        this.channel2currentSampleLeftSecondary,
        this.channel2currentSampleRightSecondary,
        this.channel3currentSampleLeftSecondary,
        this.channel3currentSampleRightSecondary,
        this.channel4currentSampleLeftSecondary,
        this.channel4currentSampleRightSecondary,
        this.channel1currentSampleLeftTrimary,
        this.channel1currentSampleRightTrimary,
        this.channel2currentSampleLeftTrimary,
        this.channel2currentSampleRightTrimary,
        this.mixerOutputCache,
        this.channel1DutyTracker,
        this.channel1CachedDuty,
        this.channel2DutyTracker,
        this.channel2CachedDuty,
        this.channel1Enabled,
        this.channel2Enabled,
        this.channel3Enabled,
        this.channel4Enabled,
        this.sequencerClocks,
        this.sequencePosition,
        this.channel3Counter,
        this.channel4Counter,
        this.cachedChannel3Sample,
        this.cachedChannel4Sample,
        this.channel3FrequencyPeriod,
        this.channel3lastSampleLookup,
        this.actualScanLine,
        this.lastUnrenderedLine,
        this.queuedScanLines,
        this.RTCisLatched,
        this.latchedSeconds,
        this.latchedMinutes,
        this.latchedHours,
        this.latchedLDays,
        this.latchedHDays,
        this.RTCSeconds,
        this.RTCMinutes,
        this.RTCHours,
        this.RTCDays,
        this.RTCDayOverFlow,
        this.RTCHALT,
        this.usedBootROM,
        this.skipPCIncrement,
        this.STATTracker,
        this.gbcRamBankPositionECHO,
        this.numRAMBanks,
        this.windowY,
        this.windowX,
        this.fromTypedArray(this.gbcOBJRawPalette),
        this.fromTypedArray(this.gbcBGRawPalette),
        this.fromTypedArray(this.gbOBJPalette),
        this.fromTypedArray(this.gbBGPalette),
        this.fromTypedArray(this.gbcOBJPalette),
        this.fromTypedArray(this.gbcBGPalette),
        this.fromTypedArray(this.gbBGColorizedPalette),
        this.fromTypedArray(this.gbOBJColorizedPalette),
        this.fromTypedArray(this.cachedBGPaletteConversion),
        this.fromTypedArray(this.cachedOBJPaletteConversion),
        this.fromTypedArray(this.BGCHRBank1),
        this.fromTypedArray(this.BGCHRBank2),
        this.haltPostClocks,
        this.interruptsRequested,
        this.interruptsEnabled,
        this.remainingClocks,
        this.colorizedGBPalettes,
        this.backgroundY,
        this.backgroundX,
        this.CPUStopped
    ];
});
GameBoyCore.prototype.returnFromState = _wrap_(function (returnedFrom) {
    var index = 0;
    var state = returnedFrom.slice(0);
    this.ROM = this.toTypedArray(state[index++], 'uint8');
    this.ROMBankEdge = Math.floor(this.ROM.length / 16384);
    this.inBootstrap = state[index++];
    this.registerA = state[index++];
    this.FZero = state[index++];
    this.FSubtract = state[index++];
    this.FHalfCarry = state[index++];
    this.FCarry = state[index++];
    this.registerB = state[index++];
    this.registerC = state[index++];
    this.registerD = state[index++];
    this.registerE = state[index++];
    this.registersHL = state[index++];
    this.stackPointer = state[index++];
    this.programCounter = state[index++];
    this.halt = state[index++];
    this.IME = state[index++];
    this.hdmaRunning = state[index++];
    this.CPUTicks = state[index++];
    this.doubleSpeedShifter = state[index++];
    this.memory = this.toTypedArray(state[index++], 'uint8');
    this.MBCRam = this.toTypedArray(state[index++], 'uint8');
    this.VRAM = this.toTypedArray(state[index++], 'uint8');
    this.currVRAMBank = state[index++];
    this.GBCMemory = this.toTypedArray(state[index++], 'uint8');
    this.MBC1Mode = state[index++];
    this.MBCRAMBanksEnabled = state[index++];
    this.currMBCRAMBank = state[index++];
    this.currMBCRAMBankPosition = state[index++];
    this.cGBC = state[index++];
    this.gbcRamBank = state[index++];
    this.gbcRamBankPosition = state[index++];
    this.ROMBank1offs = state[index++];
    this.currentROMBank = state[index++];
    this.cartridgeType = state[index++];
    this.name = state[index++];
    this.gameCode = state[index++];
    this.modeSTAT = state[index++];
    this.LYCMatchTriggerSTAT = state[index++];
    this.mode2TriggerSTAT = state[index++];
    this.mode1TriggerSTAT = state[index++];
    this.mode0TriggerSTAT = state[index++];
    this.LCDisOn = state[index++];
    this.gfxWindowCHRBankPosition = state[index++];
    this.gfxWindowDisplay = state[index++];
    this.gfxSpriteShow = state[index++];
    this.gfxSpriteNormalHeight = state[index++];
    this.gfxBackgroundCHRBankPosition = state[index++];
    this.gfxBackgroundBankOffset = state[index++];
    this.TIMAEnabled = state[index++];
    this.DIVTicks = state[index++];
    this.LCDTicks = state[index++];
    this.timerTicks = state[index++];
    this.TACClocker = state[index++];
    this.serialTimer = state[index++];
    this.serialShiftTimer = state[index++];
    this.serialShiftTimerAllocated = state[index++];
    this.IRQEnableDelay = state[index++];
    this.lastIteration = state[index++];
    this.cMBC1 = state[index++];
    this.cMBC2 = state[index++];
    this.cMBC3 = state[index++];
    this.cMBC5 = state[index++];
    this.cMBC7 = state[index++];
    this.cSRAM = state[index++];
    this.cMMMO1 = state[index++];
    this.cRUMBLE = state[index++];
    this.cCamera = state[index++];
    this.cTAMA5 = state[index++];
    this.cHuC3 = state[index++];
    this.cHuC1 = state[index++];
    this.drewBlank = state[index++];
    this.frameBuffer = this.toTypedArray(state[index++], 'int32');
    this.bgEnabled = state[index++];
    this.BGPriorityEnabled = state[index++];
    this.channel1FrequencyTracker = state[index++];
    this.channel1FrequencyCounter = state[index++];
    this.channel1totalLength = state[index++];
    this.channel1envelopeVolume = state[index++];
    this.channel1envelopeType = state[index++];
    this.channel1envelopeSweeps = state[index++];
    this.channel1envelopeSweepsLast = state[index++];
    this.channel1consecutive = state[index++];
    this.channel1frequency = state[index++];
    this.channel1SweepFault = state[index++];
    this.channel1ShadowFrequency = state[index++];
    this.channel1timeSweep = state[index++];
    this.channel1lastTimeSweep = state[index++];
    this.channel1numSweep = state[index++];
    this.channel1frequencySweepDivider = state[index++];
    this.channel1decreaseSweep = state[index++];
    this.channel2FrequencyTracker = state[index++];
    this.channel2FrequencyCounter = state[index++];
    this.channel2totalLength = state[index++];
    this.channel2envelopeVolume = state[index++];
    this.channel2envelopeType = state[index++];
    this.channel2envelopeSweeps = state[index++];
    this.channel2envelopeSweepsLast = state[index++];
    this.channel2consecutive = state[index++];
    this.channel2frequency = state[index++];
    this.channel3canPlay = state[index++];
    this.channel3totalLength = state[index++];
    this.channel3patternType = state[index++];
    this.channel3frequency = state[index++];
    this.channel3consecutive = state[index++];
    this.channel3PCM = this.toTypedArray(state[index++], 'int8');
    this.channel4FrequencyPeriod = state[index++];
    this.channel4lastSampleLookup = state[index++];
    this.channel4totalLength = state[index++];
    this.channel4envelopeVolume = state[index++];
    this.channel4currentVolume = state[index++];
    this.channel4envelopeType = state[index++];
    this.channel4envelopeSweeps = state[index++];
    this.channel4envelopeSweepsLast = state[index++];
    this.channel4consecutive = state[index++];
    this.channel4BitRange = state[index++];
    this.soundMasterEnabled = state[index++];
    this.VinLeftChannelMasterVolume = state[index++];
    this.VinRightChannelMasterVolume = state[index++];
    this.leftChannel1 = state[index++];
    this.leftChannel2 = state[index++];
    this.leftChannel3 = state[index++];
    this.leftChannel4 = state[index++];
    this.rightChannel1 = state[index++];
    this.rightChannel2 = state[index++];
    this.rightChannel3 = state[index++];
    this.rightChannel4 = state[index++];
    this.channel1currentSampleLeft = state[index++];
    this.channel1currentSampleRight = state[index++];
    this.channel2currentSampleLeft = state[index++];
    this.channel2currentSampleRight = state[index++];
    this.channel3currentSampleLeft = state[index++];
    this.channel3currentSampleRight = state[index++];
    this.channel4currentSampleLeft = state[index++];
    this.channel4currentSampleRight = state[index++];
    this.channel1currentSampleLeftSecondary = state[index++];
    this.channel1currentSampleRightSecondary = state[index++];
    this.channel2currentSampleLeftSecondary = state[index++];
    this.channel2currentSampleRightSecondary = state[index++];
    this.channel3currentSampleLeftSecondary = state[index++];
    this.channel3currentSampleRightSecondary = state[index++];
    this.channel4currentSampleLeftSecondary = state[index++];
    this.channel4currentSampleRightSecondary = state[index++];
    this.channel1currentSampleLeftTrimary = state[index++];
    this.channel1currentSampleRightTrimary = state[index++];
    this.channel2currentSampleLeftTrimary = state[index++];
    this.channel2currentSampleRightTrimary = state[index++];
    this.mixerOutputCache = state[index++];
    this.channel1DutyTracker = state[index++];
    this.channel1CachedDuty = state[index++];
    this.channel2DutyTracker = state[index++];
    this.channel2CachedDuty = state[index++];
    this.channel1Enabled = state[index++];
    this.channel2Enabled = state[index++];
    this.channel3Enabled = state[index++];
    this.channel4Enabled = state[index++];
    this.sequencerClocks = state[index++];
    this.sequencePosition = state[index++];
    this.channel3Counter = state[index++];
    this.channel4Counter = state[index++];
    this.cachedChannel3Sample = state[index++];
    this.cachedChannel4Sample = state[index++];
    this.channel3FrequencyPeriod = state[index++];
    this.channel3lastSampleLookup = state[index++];
    this.actualScanLine = state[index++];
    this.lastUnrenderedLine = state[index++];
    this.queuedScanLines = state[index++];
    this.RTCisLatched = state[index++];
    this.latchedSeconds = state[index++];
    this.latchedMinutes = state[index++];
    this.latchedHours = state[index++];
    this.latchedLDays = state[index++];
    this.latchedHDays = state[index++];
    this.RTCSeconds = state[index++];
    this.RTCMinutes = state[index++];
    this.RTCHours = state[index++];
    this.RTCDays = state[index++];
    this.RTCDayOverFlow = state[index++];
    this.RTCHALT = state[index++];
    this.usedBootROM = state[index++];
    this.skipPCIncrement = state[index++];
    this.STATTracker = state[index++];
    this.gbcRamBankPositionECHO = state[index++];
    this.numRAMBanks = state[index++];
    this.windowY = state[index++];
    this.windowX = state[index++];
    this.gbcOBJRawPalette = this.toTypedArray(state[index++], 'uint8');
    this.gbcBGRawPalette = this.toTypedArray(state[index++], 'uint8');
    this.gbOBJPalette = this.toTypedArray(state[index++], 'int32');
    this.gbBGPalette = this.toTypedArray(state[index++], 'int32');
    this.gbcOBJPalette = this.toTypedArray(state[index++], 'int32');
    this.gbcBGPalette = this.toTypedArray(state[index++], 'int32');
    this.gbBGColorizedPalette = this.toTypedArray(state[index++], 'int32');
    this.gbOBJColorizedPalette = this.toTypedArray(state[index++], 'int32');
    this.cachedBGPaletteConversion = this.toTypedArray(state[index++], 'int32');
    this.cachedOBJPaletteConversion = this.toTypedArray(state[index++], 'int32');
    this.BGCHRBank1 = this.toTypedArray(state[index++], 'uint8');
    this.BGCHRBank2 = this.toTypedArray(state[index++], 'uint8');
    this.haltPostClocks = state[index++];
    this.interruptsRequested = state[index++];
    this.interruptsEnabled = state[index++];
    this.checkIRQMatching();
    this.remainingClocks = state[index++];
    this.colorizedGBPalettes = state[index++];
    this.backgroundY = state[index++];
    this.backgroundX = state[index++];
    this.CPUStopped = state[index];
    this.fromSaveState = true;
    this.TICKTable = this.toTypedArray(this.TICKTable, 'uint8');
    this.SecondaryTICKTable = this.toTypedArray(this.SecondaryTICKTable, 'uint8');
    this.initializeReferencesFromSaveState();
    this.memoryReadJumpCompile();
    this.memoryWriteJumpCompile();
    this.initLCD();
    this.initSound();
    this.noiseSampleTable = this.channel4BitRange == 32767 ? this.LSFR15Table : this.LSFR7Table;
    this.channel4VolumeShifter = this.channel4BitRange == 32767 ? 15 : 7;
});
GameBoyCore.prototype.returnFromRTCState = _wrap_(function () {
    if (typeof this.openRTC == 'function' && this.cTIMER) {
        var rtcData = this.openRTC(this.name);
        var index = 0;
        this.lastIteration = rtcData[index++];
        this.RTCisLatched = rtcData[index++];
        this.latchedSeconds = rtcData[index++];
        this.latchedMinutes = rtcData[index++];
        this.latchedHours = rtcData[index++];
        this.latchedLDays = rtcData[index++];
        this.latchedHDays = rtcData[index++];
        this.RTCSeconds = rtcData[index++];
        this.RTCMinutes = rtcData[index++];
        this.RTCHours = rtcData[index++];
        this.RTCDays = rtcData[index++];
        this.RTCDayOverFlow = rtcData[index++];
        this.RTCHALT = rtcData[index];
    }
});
GameBoyCore.prototype.start = _wrap_(function () {
    this.initMemory();
    this.ROMLoad();
    this.initLCD();
    this.initSound();
    this.run();
});
GameBoyCore.prototype.initMemory = _wrap_(function () {
    this.memory = this.getTypedArray(65536, 0, 'uint8');
    this.frameBuffer = this.getTypedArray(23040, 16316664, 'int32');
    this.BGCHRBank1 = this.getTypedArray(2048, 0, 'uint8');
    this.TICKTable = this.toTypedArray(this.TICKTable, 'uint8');
    this.SecondaryTICKTable = this.toTypedArray(this.SecondaryTICKTable, 'uint8');
    this.channel3PCM = this.getTypedArray(32, 0, 'int8');
});
GameBoyCore.prototype.generateCacheArray = _wrap_(function (tileAmount) {
    var tileArray = [];
    var tileNumber = 0;
    while (tileNumber < tileAmount) {
        tileArray[tileNumber++] = this.getTypedArray(64, 0, 'uint8');
    }
    return tileArray;
});
GameBoyCore.prototype.initSkipBootstrap = _wrap_(function () {
    var index = 255;
    while (index >= 0) {
        if (index >= 48 && index < 64) {
            this.memoryWrite(65280 | index, this.ffxxDump[index]);
        } else {
            switch (index) {
            case 0:
            case 1:
            case 2:
            case 5:
            case 7:
            case 15:
            case 255:
                this.memoryWrite(65280 | index, this.ffxxDump[index]);
                break;
            default:
                this.memory[65280 | index] = this.ffxxDump[index];
            }
        }
        --index;
    }
    if (this.cGBC) {
        this.memory[65388] = 254;
        this.memory[65396] = 254;
    } else {
        this.memory[65352] = 255;
        this.memory[65353] = 255;
        this.memory[65388] = 255;
        this.memory[65396] = 255;
    }
    cout('Starting without the GBC boot ROM.', 0);
    this.registerA = this.cGBC ? 17 : 1;
    this.registerB = 0;
    this.registerC = 19;
    this.registerD = 0;
    this.registerE = 216;
    this.FZero = true;
    this.FSubtract = false;
    this.FHalfCarry = true;
    this.FCarry = true;
    this.registersHL = 333;
    this.LCDCONTROL = this.LINECONTROL;
    this.IME = false;
    this.IRQLineMatched = 0;
    this.interruptsRequested = 225;
    this.interruptsEnabled = 0;
    this.hdmaRunning = false;
    this.CPUTicks = 12;
    this.STATTracker = 0;
    this.modeSTAT = 1;
    this.spriteCount = 252;
    this.LYCMatchTriggerSTAT = false;
    this.mode2TriggerSTAT = false;
    this.mode1TriggerSTAT = false;
    this.mode0TriggerSTAT = false;
    this.LCDisOn = true;
    this.channel1FrequencyTracker = 8192;
    this.channel1DutyTracker = 0;
    this.channel1CachedDuty = this.dutyLookup[2];
    this.channel1totalLength = 0;
    this.channel1envelopeVolume = 0;
    this.channel1envelopeType = false;
    this.channel1envelopeSweeps = 0;
    this.channel1envelopeSweepsLast = 0;
    this.channel1consecutive = true;
    this.channel1frequency = 1985;
    this.channel1SweepFault = true;
    this.channel1ShadowFrequency = 1985;
    this.channel1timeSweep = 1;
    this.channel1lastTimeSweep = 0;
    this.channel1numSweep = 0;
    this.channel1frequencySweepDivider = 0;
    this.channel1decreaseSweep = false;
    this.channel2FrequencyTracker = 8192;
    this.channel2DutyTracker = 0;
    this.channel2CachedDuty = this.dutyLookup[2];
    this.channel2totalLength = 0;
    this.channel2envelopeVolume = 0;
    this.channel2envelopeType = false;
    this.channel2envelopeSweeps = 0;
    this.channel2envelopeSweepsLast = 0;
    this.channel2consecutive = true;
    this.channel2frequency = 0;
    this.channel3canPlay = false;
    this.channel3totalLength = 0;
    this.channel3patternType = 4;
    this.channel3frequency = 0;
    this.channel3consecutive = true;
    this.channel3Counter = 1048;
    this.channel4FrequencyPeriod = 8;
    this.channel4totalLength = 0;
    this.channel4envelopeVolume = 0;
    this.channel4currentVolume = 0;
    this.channel4envelopeType = false;
    this.channel4envelopeSweeps = 0;
    this.channel4envelopeSweepsLast = 0;
    this.channel4consecutive = true;
    this.channel4BitRange = 32767;
    this.channel4VolumeShifter = 15;
    this.channel1FrequencyCounter = 512;
    this.channel2FrequencyCounter = 512;
    this.channel3Counter = 2048;
    this.channel3FrequencyPeriod = 2048;
    this.channel3lastSampleLookup = 0;
    this.channel4lastSampleLookup = 0;
    this.VinLeftChannelMasterVolume = 1;
    this.VinRightChannelMasterVolume = 1;
    this.soundMasterEnabled = true;
    this.leftChannel1 = true;
    this.leftChannel2 = true;
    this.leftChannel3 = true;
    this.leftChannel4 = true;
    this.rightChannel1 = true;
    this.rightChannel2 = true;
    this.rightChannel3 = false;
    this.rightChannel4 = false;
    this.DIVTicks = 27044;
    this.LCDTicks = 160;
    this.timerTicks = 0;
    this.TIMAEnabled = false;
    this.TACClocker = 1024;
    this.serialTimer = 0;
    this.serialShiftTimer = 0;
    this.serialShiftTimerAllocated = 0;
    this.IRQEnableDelay = 0;
    this.actualScanLine = 144;
    this.lastUnrenderedLine = 0;
    this.gfxWindowDisplay = false;
    this.gfxSpriteShow = false;
    this.gfxSpriteNormalHeight = true;
    this.bgEnabled = true;
    this.BGPriorityEnabled = true;
    this.gfxWindowCHRBankPosition = 0;
    this.gfxBackgroundCHRBankPosition = 0;
    this.gfxBackgroundBankOffset = 0;
    this.windowY = 0;
    this.windowX = 0;
    this.drewBlank = 0;
    this.midScanlineOffset = -1;
    this.currentX = 0;
});
GameBoyCore.prototype.initBootstrap = _wrap_(function () {
    cout('Starting the selected boot ROM.', 0);
    this.programCounter = 0;
    this.stackPointer = 0;
    this.IME = false;
    this.LCDTicks = 0;
    this.DIVTicks = 0;
    this.registerA = 0;
    this.registerB = 0;
    this.registerC = 0;
    this.registerD = 0;
    this.registerE = 0;
    this.FZero = this.FSubtract = this.FHalfCarry = this.FCarry = false;
    this.registersHL = 0;
    this.leftChannel1 = false;
    this.leftChannel2 = false;
    this.leftChannel3 = false;
    this.leftChannel4 = false;
    this.rightChannel1 = false;
    this.rightChannel2 = false;
    this.rightChannel3 = false;
    this.rightChannel4 = false;
    this.channel2frequency = this.channel1frequency = 0;
    this.channel4consecutive = this.channel2consecutive = this.channel1consecutive = false;
    this.VinLeftChannelMasterVolume = 8;
    this.VinRightChannelMasterVolume = 8;
    this.memory[65280] = 15;
});
GameBoyCore.prototype.ROMLoad = _wrap_(function () {
    this.ROM = [];
    this.usedBootROM = settings[1];
    var maxLength = this.ROMImage.length;
    if (maxLength < 16384) {
        throw new Error('ROM image size too small.');
    }
    this.ROM = this.getTypedArray(maxLength, 0, 'uint8');
    var romIndex = 0;
    if (this.usedBootROM) {
        if (!settings[11]) {
            for (; romIndex < 256; ++romIndex) {
                this.memory[romIndex] = this.GBCBOOTROM[romIndex];
                this.ROM[romIndex] = this.ROMImage.charCodeAt(romIndex) & 255;
            }
            for (; romIndex < 512; ++romIndex) {
                this.memory[romIndex] = this.ROM[romIndex] = this.ROMImage.charCodeAt(romIndex) & 255;
            }
            for (; romIndex < 2304; ++romIndex) {
                this.memory[romIndex] = this.GBCBOOTROM[romIndex - 256];
                this.ROM[romIndex] = this.ROMImage.charCodeAt(romIndex) & 255;
            }
            this.usedGBCBootROM = true;
        } else {
            for (; romIndex < 256; ++romIndex) {
                this.memory[romIndex] = this.GBBOOTROM[romIndex];
                this.ROM[romIndex] = this.ROMImage.charCodeAt(romIndex) & 255;
            }
        }
        for (; romIndex < 16384; ++romIndex) {
            this.memory[romIndex] = this.ROM[romIndex] = this.ROMImage.charCodeAt(romIndex) & 255;
        }
    } else {
        for (; romIndex < 16384; ++romIndex) {
            this.memory[romIndex] = this.ROM[romIndex] = this.ROMImage.charCodeAt(romIndex) & 255;
        }
    }
    for (; romIndex < maxLength; ++romIndex) {
        this.ROM[romIndex] = this.ROMImage.charCodeAt(romIndex) & 255;
    }
    this.ROMBankEdge = Math.floor(this.ROM.length / 16384);
    this.interpretCartridge();
    this.checkIRQMatching();
});
GameBoyCore.prototype.getROMImage = _wrap_(function () {
    if (this.ROMImage.length > 0) {
        return this.ROMImage.length;
    }
    var length = this.ROM.length;
    for (var index = 0; index < length; index++) {
        this.ROMImage += String.fromCharCode(this.ROM[index]);
    }
    return this.ROMImage;
});
GameBoyCore.prototype.interpretCartridge = _wrap_(function () {
    for (var index = 308; index < 319; index++) {
        if (this.ROMImage.charCodeAt(index) > 0) {
            this.name += this.ROMImage[index];
        }
    }
    for (var index = 319; index < 323; index++) {
        if (this.ROMImage.charCodeAt(index) > 0) {
            this.gameCode += this.ROMImage[index];
        }
    }
    cout('Game Title: ' + this.name + '[' + this.gameCode + '][' + this.ROMImage[323] + ']', 0);
    cout('Game Code: ' + this.gameCode, 0);
    this.cartridgeType = this.ROM[327];
    cout('Cartridge type #' + this.cartridgeType, 0);
    var MBCType = '';
    switch (this.cartridgeType) {
    case 0:
        if (!settings[9]) {
            MBCType = 'ROM';
            break;
        }
    case 1:
        this.cMBC1 = true;
        MBCType = 'MBC1';
        break;
    case 2:
        this.cMBC1 = true;
        this.cSRAM = true;
        MBCType = 'MBC1 + SRAM';
        break;
    case 3:
        this.cMBC1 = true;
        this.cSRAM = true;
        this.cBATT = true;
        MBCType = 'MBC1 + SRAM + BATT';
        break;
    case 5:
        this.cMBC2 = true;
        MBCType = 'MBC2';
        break;
    case 6:
        this.cMBC2 = true;
        this.cBATT = true;
        MBCType = 'MBC2 + BATT';
        break;
    case 8:
        this.cSRAM = true;
        MBCType = 'ROM + SRAM';
        break;
    case 9:
        this.cSRAM = true;
        this.cBATT = true;
        MBCType = 'ROM + SRAM + BATT';
        break;
    case 11:
        this.cMMMO1 = true;
        MBCType = 'MMMO1';
        break;
    case 12:
        this.cMMMO1 = true;
        this.cSRAM = true;
        MBCType = 'MMMO1 + SRAM';
        break;
    case 13:
        this.cMMMO1 = true;
        this.cSRAM = true;
        this.cBATT = true;
        MBCType = 'MMMO1 + SRAM + BATT';
        break;
    case 15:
        this.cMBC3 = true;
        this.cTIMER = true;
        this.cBATT = true;
        MBCType = 'MBC3 + TIMER + BATT';
        break;
    case 16:
        this.cMBC3 = true;
        this.cTIMER = true;
        this.cBATT = true;
        this.cSRAM = true;
        MBCType = 'MBC3 + TIMER + BATT + SRAM';
        break;
    case 17:
        this.cMBC3 = true;
        MBCType = 'MBC3';
        break;
    case 18:
        this.cMBC3 = true;
        this.cSRAM = true;
        MBCType = 'MBC3 + SRAM';
        break;
    case 19:
        this.cMBC3 = true;
        this.cSRAM = true;
        this.cBATT = true;
        MBCType = 'MBC3 + SRAM + BATT';
        break;
    case 25:
        this.cMBC5 = true;
        MBCType = 'MBC5';
        break;
    case 26:
        this.cMBC5 = true;
        this.cSRAM = true;
        MBCType = 'MBC5 + SRAM';
        break;
    case 27:
        this.cMBC5 = true;
        this.cSRAM = true;
        this.cBATT = true;
        MBCType = 'MBC5 + SRAM + BATT';
        break;
    case 28:
        this.cRUMBLE = true;
        MBCType = 'RUMBLE';
        break;
    case 29:
        this.cRUMBLE = true;
        this.cSRAM = true;
        MBCType = 'RUMBLE + SRAM';
        break;
    case 30:
        this.cRUMBLE = true;
        this.cSRAM = true;
        this.cBATT = true;
        MBCType = 'RUMBLE + SRAM + BATT';
        break;
    case 31:
        this.cCamera = true;
        MBCType = 'GameBoy Camera';
        break;
    case 34:
        this.cMBC7 = true;
        this.cSRAM = true;
        this.cBATT = true;
        MBCType = 'MBC7 + SRAM + BATT';
        break;
    case 253:
        this.cTAMA5 = true;
        MBCType = 'TAMA5';
        break;
    case 254:
        this.cHuC3 = true;
        MBCType = 'HuC3';
        break;
    case 255:
        this.cHuC1 = true;
        MBCType = 'HuC1';
        break;
    default:
        MBCType = 'Unknown';
        cout('Cartridge type is unknown.', 2);
        pause();
    }
    cout('Cartridge Type: ' + MBCType + '.', 0);
    this.numROMBanks = this.ROMBanks[this.ROM[328]];
    cout(this.numROMBanks + ' ROM banks.', 0);
    switch (this.RAMBanks[this.ROM[329]]) {
    case 0:
        cout('No RAM banking requested for allocation or MBC is of type 2.', 0);
        break;
    case 2:
        cout('1 RAM bank requested for allocation.', 0);
        break;
    case 3:
        cout('4 RAM banks requested for allocation.', 0);
        break;
    case 4:
        cout('16 RAM banks requested for allocation.', 0);
        break;
    default:
        cout('RAM bank amount requested is unknown, will use maximum allowed by specified MBC type.', 0);
    }
    if (!this.usedBootROM) {
        switch (this.ROM[323]) {
        case 0:
            this.cGBC = false;
            cout('Only GB mode detected.', 0);
            break;
        case 50:
            if (!settings[2] && this.name + this.gameCode + this.ROM[323] == 'Game and Watch 50') {
                this.cGBC = true;
                cout('Created a boot exception for Game and Watch Gallery 2 (GBC ID byte is wrong on the cartridge).', 1);
            } else {
                this.cGBC = false;
            }
            break;
        case 128:
            this.cGBC = !settings[2];
            cout('GB and GBC mode detected.', 0);
            break;
        case 192:
            this.cGBC = true;
            cout('Only GBC mode detected.', 0);
            break;
        default:
            this.cGBC = false;
            cout('Unknown GameBoy game type code #' + this.ROM[323] + ', defaulting to GB mode (Old games don\'t have a type code).', 1);
        }
        this.inBootstrap = false;
        this.setupRAM();
        this.initSkipBootstrap();
        this.initializeAudioStartState();
    } else {
        this.cGBC = this.usedGBCBootROM;
        this.setupRAM();
        this.initBootstrap();
    }
    this.initializeModeSpecificArrays();
    var cOldLicense = this.ROM[331];
    var cNewLicense = this.ROM[324] & 65280 | this.ROM[325] & 255;
    if (cOldLicense != 51) {
        cout('Old style license code: ' + cOldLicense, 0);
    } else {
        cout('New style license code: ' + cNewLicense, 0);
    }
    this.ROMImage = '';
});
GameBoyCore.prototype.disableBootROM = _wrap_(function () {
    for (var index = 0; index < 256; ++index) {
        this.memory[index] = this.ROM[index];
    }
    if (this.usedGBCBootROM) {
        for (index = 512; index < 2304; ++index) {
            this.memory[index] = this.ROM[index];
        }
        if (!this.cGBC) {
            this.GBCtoGBModeAdjust();
        } else {
            this.recompileBootIOWriteHandling();
        }
    } else {
        this.recompileBootIOWriteHandling();
    }
});
GameBoyCore.prototype.initializeTiming = _wrap_(function () {
    this.baseCPUCyclesPerIteration = 524288 / 125 * settings[6];
    this.CPUCyclesTotalRoundoff = this.baseCPUCyclesPerIteration % 4;
    this.CPUCyclesTotalBase = this.CPUCyclesTotal = this.baseCPUCyclesPerIteration - this.CPUCyclesTotalRoundoff | 0;
    this.CPUCyclesTotalCurrent = 0;
});
GameBoyCore.prototype.setupRAM = _wrap_(function () {
    if (this.cMBC2) {
        this.numRAMBanks = 1 / 16;
    } else if (this.cMBC1 || this.cRUMBLE || this.cMBC3 || this.cHuC3) {
        this.numRAMBanks = 4;
    } else if (this.cMBC5) {
        this.numRAMBanks = 16;
    } else if (this.cSRAM) {
        this.numRAMBanks = 1;
    }
    if (this.numRAMBanks > 0) {
        if (!this.MBCRAMUtilized()) {
            this.MBCRAMBanksEnabled = true;
        }
        var MBCRam = typeof this.openMBC == 'function' ? this.openMBC(this.name) : [];
        if (MBCRam.length > 0) {
            this.MBCRam = this.toTypedArray(MBCRam, 'uint8');
        } else {
            this.MBCRam = this.getTypedArray(this.numRAMBanks * 8192, 0, 'uint8');
        }
    }
    cout('Actual bytes of MBC RAM allocated: ' + this.numRAMBanks * 8192, 0);
    this.returnFromRTCState();
    if (this.cGBC) {
        this.VRAM = this.getTypedArray(8192, 0, 'uint8');
        this.GBCMemory = this.getTypedArray(28672, 0, 'uint8');
    }
    this.memoryReadJumpCompile();
    this.memoryWriteJumpCompile();
});
GameBoyCore.prototype.MBCRAMUtilized = _wrap_(function () {
    return this.cMBC1 || this.cMBC2 || this.cMBC3 || this.cMBC5 || this.cMBC7 || this.cRUMBLE;
});
GameBoyCore.prototype.recomputeDimension = _wrap_(function () {
    initNewCanvas();
    this.onscreenWidth = this.canvas.width;
    this.onscreenHeight = this.canvas.height;
    if (GameBoyWindow && GameBoyWindow.mozRequestAnimationFrame) {
        this.canvas.width = this.onscreenWidth = !settings[12] ? 160 : this.canvas.width;
        this.canvas.height = this.onscreenHeight = !settings[12] ? 144 : this.canvas.height;
    } else {
        this.onscreenWidth = this.canvas.width;
        this.onscreenHeight = this.canvas.height;
    }
    this.offscreenWidth = !settings[12] ? 160 : this.canvas.width;
    this.offscreenHeight = !settings[12] ? 144 : this.canvas.height;
    this.offscreenRGBCount = this.offscreenWidth * this.offscreenHeight * 4;
});
GameBoyCore.prototype.initLCD = _wrap_(function () {
    this.recomputeDimension();
    if (this.offscreenRGBCount != 92160) {
        this.compileResizeFrameBufferFunction();
    } else {
        this.resizer = null;
    }
    try {
        this.canvasOffscreen = new GameBoyCanvas();
        this.canvasOffscreen.width = this.offscreenWidth;
        this.canvasOffscreen.height = this.offscreenHeight;
        this.drawContextOffscreen = this.canvasOffscreen.getContext('2d');
        this.drawContextOnscreen = this.canvas.getContext('2d');
        try {
            this.canvasBuffer = this.drawContextOffscreen.createImageData(this.offscreenWidth, this.offscreenHeight);
        } catch (error) {
            cout('Falling back to the getImageData initialization (Error "' + error.message + '").', 1);
            this.canvasBuffer = this.drawContextOffscreen.getImageData(0, 0, this.offscreenWidth, this.offscreenHeight);
        }
        var index = this.offscreenRGBCount;
        while (index > 0) {
            this.canvasBuffer.data[index -= 4] = 248;
            this.canvasBuffer.data[index + 1] = 248;
            this.canvasBuffer.data[index + 2] = 248;
            this.canvasBuffer.data[index + 3] = 255;
        }
        this.graphicsBlit();
        this.canvas.style.visibility = 'visible';
        if (this.swizzledFrame == null) {
            this.swizzledFrame = this.getTypedArray(69120, 255, 'uint8');
        }
        this.drewFrame = true;
        this.requestDraw();
    } catch (error) {
        throw new Error('HTML5 Canvas support required: ' + error.message + 'file: ' + error.fileName + ', line: ' + error.lineNumber);
    }
});
GameBoyCore.prototype.graphicsBlit = _wrap_(function () {
    if (this.offscreenWidth == this.onscreenWidth && this.offscreenHeight == this.onscreenHeight) {
        this.drawContextOnscreen.putImageData(this.canvasBuffer, 0, 0);
    } else {
        this.drawContextOffscreen.putImageData(this.canvasBuffer, 0, 0);
        this.drawContextOnscreen.drawImage(this.canvasOffscreen, 0, 0, this.onscreenWidth, this.onscreenHeight);
    }
});
GameBoyCore.prototype.JoyPadEvent = _wrap_(function (key, down) {
    if (down) {
        this.JoyPad &= 255 ^ 1 << key;
        if (!this.cGBC && (!this.usedBootROM || !this.usedGBCBootROM)) {
            this.interruptsRequested |= 16;
            this.remainingClocks = 0;
            this.checkIRQMatching();
        }
    } else {
        this.JoyPad |= 1 << key;
    }
    this.memory[65280] = (this.memory[65280] & 48) + (((this.memory[65280] & 32) == 0 ? this.JoyPad >> 4 : 15) & ((this.memory[65280] & 16) == 0 ? this.JoyPad & 15 : 15));
    this.CPUStopped = false;
});
GameBoyCore.prototype.GyroEvent = _wrap_(function (x, y) {
    x *= -100;
    x += 2047;
    this.highX = x >> 8;
    this.lowX = x & 255;
    y *= -100;
    y += 2047;
    this.highY = y >> 8;
    this.lowY = y & 255;
});
GameBoyCore.prototype.initSound = _wrap_(function () {
    this.sampleSize = 4194304 / 1000 * settings[6];
    this.machineOut = settings[13];
    if (settings[0]) {
        try {
            var parentObj = this;
            this.audioHandle = new XAudioServer(2, 4194304 / settings[13], 0, Math.max(this.sampleSize * settings[8] / settings[13], 8192) << 1, null, settings[14]);
            this.initAudioBuffer();
        } catch (error) {
            cout('Audio system cannot run: ' + error.message, 2);
            settings[0] = false;
        }
    } else if (this.audioHandle) {
        try {
            this.audioHandle.changeVolume(0);
        } catch (error) {
        }
    }
});
GameBoyCore.prototype.changeVolume = _wrap_(function () {
    if (settings[0] && this.audioHandle) {
        try {
            this.audioHandle.changeVolume(settings[14]);
        } catch (error) {
        }
    }
});
GameBoyCore.prototype.initAudioBuffer = _wrap_(function () {
    this.audioIndex = 0;
    this.bufferContainAmount = Math.max(this.sampleSize * settings[7] / settings[13], 4096) << 1;
    this.numSamplesTotal = this.sampleSize - this.sampleSize % settings[13] | 0;
    this.currentBuffer = this.getTypedArray(this.numSamplesTotal, 61680, 'int32');
    this.secondaryBuffer = this.getTypedArray((this.numSamplesTotal << 1) / settings[13], 0, 'float32');
});
GameBoyCore.prototype.intializeWhiteNoise = _wrap_(function () {
    var randomFactor = 1;
    this.LSFR15Table = this.getTypedArray(524288, 0, 'int8');
    var LSFR = 32767;
    var LSFRShifted = 16383;
    for (var index = 0; index < 32768; ++index) {
        randomFactor = 1 - (LSFR & 1);
        this.LSFR15Table[32768 | index] = randomFactor;
        this.LSFR15Table[65536 | index] = randomFactor * 2;
        this.LSFR15Table[98304 | index] = randomFactor * 3;
        this.LSFR15Table[131072 | index] = randomFactor * 4;
        this.LSFR15Table[163840 | index] = randomFactor * 5;
        this.LSFR15Table[196608 | index] = randomFactor * 6;
        this.LSFR15Table[229376 | index] = randomFactor * 7;
        this.LSFR15Table[262144 | index] = randomFactor * 8;
        this.LSFR15Table[294912 | index] = randomFactor * 9;
        this.LSFR15Table[327680 | index] = randomFactor * 10;
        this.LSFR15Table[360448 | index] = randomFactor * 11;
        this.LSFR15Table[393216 | index] = randomFactor * 12;
        this.LSFR15Table[425984 | index] = randomFactor * 13;
        this.LSFR15Table[458752 | index] = randomFactor * 14;
        this.LSFR15Table[491520 | index] = randomFactor * 15;
        LSFRShifted = LSFR >> 1;
        LSFR = LSFRShifted | ((LSFRShifted ^ LSFR) & 1) << 14;
    }
    this.LSFR7Table = this.getTypedArray(2048, 0, 'int8');
    LSFR = 127;
    for (index = 0; index < 128; ++index) {
        randomFactor = 1 - (LSFR & 1);
        this.LSFR7Table[128 | index] = randomFactor;
        this.LSFR7Table[256 | index] = randomFactor * 2;
        this.LSFR7Table[384 | index] = randomFactor * 3;
        this.LSFR7Table[512 | index] = randomFactor * 4;
        this.LSFR7Table[640 | index] = randomFactor * 5;
        this.LSFR7Table[768 | index] = randomFactor * 6;
        this.LSFR7Table[896 | index] = randomFactor * 7;
        this.LSFR7Table[1024 | index] = randomFactor * 8;
        this.LSFR7Table[1152 | index] = randomFactor * 9;
        this.LSFR7Table[1280 | index] = randomFactor * 10;
        this.LSFR7Table[1408 | index] = randomFactor * 11;
        this.LSFR7Table[1536 | index] = randomFactor * 12;
        this.LSFR7Table[1664 | index] = randomFactor * 13;
        this.LSFR7Table[1792 | index] = randomFactor * 14;
        this.LSFR7Table[1920 | index] = randomFactor * 15;
        LSFRShifted = LSFR >> 1;
        LSFR = LSFRShifted | ((LSFRShifted ^ LSFR) & 1) << 6;
    }
    if (!this.noiseSampleTable && this.memory.length == 65536) {
        this.noiseSampleTable = (this.memory[65314] & 8) == 8 ? this.LSFR7Table : this.LSFR15Table;
    }
});
GameBoyCore.prototype.audioUnderrunAdjustment = _wrap_(function () {
    if (settings[0]) {
        var underrunAmount = this.bufferContainAmount - this.audioHandle.remainingBuffer();
        if (underrunAmount > 0) {
            this.CPUCyclesTotalCurrent += (underrunAmount >> 1) * this.machineOut;
            this.recalculateIterationClockLimit();
        }
    }
});
GameBoyCore.prototype.initializeAudioStartState = _wrap_(function () {
    this.channel1FrequencyTracker = 8192;
    this.channel1DutyTracker = 0;
    this.channel1CachedDuty = this.dutyLookup[2];
    this.channel1totalLength = 0;
    this.channel1envelopeVolume = 0;
    this.channel1envelopeType = false;
    this.channel1envelopeSweeps = 0;
    this.channel1envelopeSweepsLast = 0;
    this.channel1consecutive = true;
    this.channel1frequency = 0;
    this.channel1SweepFault = false;
    this.channel1ShadowFrequency = 0;
    this.channel1timeSweep = 1;
    this.channel1lastTimeSweep = 0;
    this.channel1numSweep = 0;
    this.channel1frequencySweepDivider = 0;
    this.channel1decreaseSweep = false;
    this.channel2FrequencyTracker = 8192;
    this.channel2DutyTracker = 0;
    this.channel2CachedDuty = this.dutyLookup[2];
    this.channel2totalLength = 0;
    this.channel2envelopeVolume = 0;
    this.channel2envelopeType = false;
    this.channel2envelopeSweeps = 0;
    this.channel2envelopeSweepsLast = 0;
    this.channel2consecutive = true;
    this.channel2frequency = 0;
    this.channel3canPlay = false;
    this.channel3totalLength = 0;
    this.channel3patternType = 4;
    this.channel3frequency = 0;
    this.channel3consecutive = true;
    this.channel3Counter = 2048;
    this.channel4FrequencyPeriod = 8;
    this.channel4totalLength = 0;
    this.channel4envelopeVolume = 0;
    this.channel4currentVolume = 0;
    this.channel4envelopeType = false;
    this.channel4envelopeSweeps = 0;
    this.channel4envelopeSweepsLast = 0;
    this.channel4consecutive = true;
    this.channel4BitRange = 32767;
    this.noiseSampleTable = this.LSFR15Table;
    this.channel4VolumeShifter = 15;
    this.channel1FrequencyCounter = 8192;
    this.channel2FrequencyCounter = 8192;
    this.channel3Counter = 2048;
    this.channel3FrequencyPeriod = 2048;
    this.channel3lastSampleLookup = 0;
    this.channel4lastSampleLookup = 0;
    this.VinLeftChannelMasterVolume = 8;
    this.VinRightChannelMasterVolume = 8;
    this.mixerOutputCache = 0;
    this.sequencerClocks = 8192;
    this.sequencePosition = 0;
    this.channel4FrequencyPeriod = 8;
    this.channel4Counter = 8;
    this.cachedChannel3Sample = 0;
    this.cachedChannel4Sample = 0;
    this.channel1Enabled = false;
    this.channel2Enabled = false;
    this.channel3Enabled = false;
    this.channel4Enabled = false;
    this.channel1canPlay = false;
    this.channel2canPlay = false;
    this.channel4canPlay = false;
    this.channel1OutputLevelCache();
    this.channel2OutputLevelCache();
    this.channel3OutputLevelCache();
    this.channel4OutputLevelCache();
});
GameBoyCore.prototype.outputAudio = _wrap_(function () {
    var sampleFactor = 0;
    var dirtySample = 0;
    var averageL = 0;
    var averageR = 0;
    var destinationPosition = 0;
    var divisor1 = settings[13];
    var divisor2 = divisor1 * 240;
    for (var sourcePosition = 0; sourcePosition < this.numSamplesTotal;) {
        for (sampleFactor = averageL = averageR = 0; sampleFactor < divisor1; ++sampleFactor) {
            dirtySample = this.currentBuffer[sourcePosition++];
            averageL += dirtySample >> 9;
            averageR += dirtySample & 511;
        }
        this.secondaryBuffer[destinationPosition++] = averageL / divisor2 - 1;
        this.secondaryBuffer[destinationPosition++] = averageR / divisor2 - 1;
    }
    this.audioHandle.writeAudioNoCallback(this.secondaryBuffer);
});
GameBoyCore.prototype.generateAudio = _wrap_(function (numSamples) {
    if (this.soundMasterEnabled && !this.CPUStopped) {
        for (var samplesToGenerate = 0; numSamples > 0;) {
            samplesToGenerate = numSamples < this.sequencerClocks ? numSamples : this.sequencerClocks;
            this.sequencerClocks -= samplesToGenerate;
            numSamples -= samplesToGenerate;
            while (--samplesToGenerate > -1) {
                this.computeAudioChannels();
                this.currentBuffer[this.audioIndex++] = this.mixerOutputCache;
                if (this.audioIndex == this.numSamplesTotal) {
                    this.audioIndex = 0;
                    this.outputAudio();
                }
            }
            if (this.sequencerClocks == 0) {
                this.audioComputeSequencer();
                this.sequencerClocks = 8192;
            }
        }
    } else {
        while (--numSamples > -1) {
            this.currentBuffer[this.audioIndex++] = 61680;
            if (this.audioIndex == this.numSamplesTotal) {
                this.audioIndex = 0;
                this.outputAudio();
            }
        }
    }
});
GameBoyCore.prototype.generateAudioFake = _wrap_(function (numSamples) {
    if (this.soundMasterEnabled && !this.CPUStopped) {
        while (--numSamples > -1) {
            this.computeAudioChannels();
            if (--this.sequencerClocks == 0) {
                this.audioComputeSequencer();
                this.sequencerClocks = 8192;
            }
        }
    }
});
GameBoyCore.prototype.audioJIT = _wrap_(function () {
    if (settings[0]) {
        this.generateAudio(this.audioTicks);
    } else {
        this.generateAudioFake(this.audioTicks);
    }
    this.audioTicks = 0;
});
GameBoyCore.prototype.audioComputeSequencer = _wrap_(function () {
    switch (this.sequencePosition++) {
    case 0:
        this.clockAudioLength();
        break;
    case 2:
        this.clockAudioLength();
        this.clockAudioSweep();
        break;
    case 4:
        this.clockAudioLength();
        break;
    case 6:
        this.clockAudioLength();
        this.clockAudioSweep();
        break;
    case 7:
        this.clockAudioEnvelope();
        this.sequencePosition = 0;
    }
});
GameBoyCore.prototype.clockAudioLength = _wrap_(function () {
    if (this.channel1totalLength > 1) {
        --this.channel1totalLength;
    } else if (this.channel1totalLength == 1) {
        this.channel1totalLength = 0;
        this.channel1EnableCheck();
        this.memory[65318] &= 254;
    }
    if (this.channel2totalLength > 1) {
        --this.channel2totalLength;
    } else if (this.channel2totalLength == 1) {
        this.channel2totalLength = 0;
        this.channel2EnableCheck();
        this.memory[65318] &= 253;
    }
    if (this.channel3totalLength > 1) {
        --this.channel3totalLength;
    } else if (this.channel3totalLength == 1) {
        this.channel3totalLength = 0;
        this.channel3EnableCheck();
        this.memory[65318] &= 251;
    }
    if (this.channel4totalLength > 1) {
        --this.channel4totalLength;
    } else if (this.channel4totalLength == 1) {
        this.channel4totalLength = 0;
        this.channel4EnableCheck();
        this.memory[65318] &= 247;
    }
});
GameBoyCore.prototype.clockAudioSweep = _wrap_(function () {
    if (!this.channel1SweepFault && this.channel1timeSweep > 0) {
        if (--this.channel1timeSweep == 0) {
            this.runAudioSweep();
        }
    }
});
GameBoyCore.prototype.runAudioSweep = _wrap_(function () {
    if (this.channel1lastTimeSweep > 0) {
        if (this.channel1frequencySweepDivider > 0) {
            if (this.channel1numSweep > 0) {
                --this.channel1numSweep;
                if (this.channel1decreaseSweep) {
                    this.channel1ShadowFrequency -= this.channel1ShadowFrequency >> this.channel1frequencySweepDivider;
                    this.channel1frequency = this.channel1ShadowFrequency & 2047;
                    this.channel1FrequencyTracker = 2048 - this.channel1frequency << 2;
                } else {
                    this.channel1ShadowFrequency += this.channel1ShadowFrequency >> this.channel1frequencySweepDivider;
                    this.channel1frequency = this.channel1ShadowFrequency;
                    if (this.channel1ShadowFrequency <= 2047) {
                        this.channel1FrequencyTracker = 2048 - this.channel1frequency << 2;
                        if (this.channel1ShadowFrequency + (this.channel1ShadowFrequency >> this.channel1frequencySweepDivider) > 2047) {
                            this.channel1SweepFault = true;
                            this.channel1EnableCheck();
                            this.memory[65318] &= 254;
                        }
                    } else {
                        this.channel1frequency &= 2047;
                        this.channel1SweepFault = true;
                        this.channel1EnableCheck();
                        this.memory[65318] &= 254;
                    }
                }
            }
            this.channel1timeSweep = this.channel1lastTimeSweep;
        } else {
            this.channel1SweepFault = true;
            this.channel1EnableCheck();
        }
    }
});
GameBoyCore.prototype.clockAudioEnvelope = _wrap_(function () {
    if (this.channel1envelopeSweepsLast > -1) {
        if (this.channel1envelopeSweeps > 0) {
            --this.channel1envelopeSweeps;
        } else {
            if (!this.channel1envelopeType) {
                if (this.channel1envelopeVolume > 0) {
                    --this.channel1envelopeVolume;
                    this.channel1envelopeSweeps = this.channel1envelopeSweepsLast;
                    this.channel1OutputLevelCache();
                } else {
                    this.channel1envelopeSweepsLast = -1;
                }
            } else if (this.channel1envelopeVolume < 15) {
                ++this.channel1envelopeVolume;
                this.channel1envelopeSweeps = this.channel1envelopeSweepsLast;
                this.channel1OutputLevelCache();
            } else {
                this.channel1envelopeSweepsLast = -1;
            }
        }
    }
    if (this.channel2envelopeSweepsLast > -1) {
        if (this.channel2envelopeSweeps > 0) {
            --this.channel2envelopeSweeps;
        } else {
            if (!this.channel2envelopeType) {
                if (this.channel2envelopeVolume > 0) {
                    --this.channel2envelopeVolume;
                    this.channel2envelopeSweeps = this.channel2envelopeSweepsLast;
                    this.channel2OutputLevelCache();
                } else {
                    this.channel2envelopeSweepsLast = -1;
                }
            } else if (this.channel2envelopeVolume < 15) {
                ++this.channel2envelopeVolume;
                this.channel2envelopeSweeps = this.channel2envelopeSweepsLast;
                this.channel2OutputLevelCache();
            } else {
                this.channel2envelopeSweepsLast = -1;
            }
        }
    }
    if (this.channel4envelopeSweepsLast > -1) {
        if (this.channel4envelopeSweeps > 0) {
            --this.channel4envelopeSweeps;
        } else {
            if (!this.channel4envelopeType) {
                if (this.channel4envelopeVolume > 0) {
                    this.channel4currentVolume = --this.channel4envelopeVolume << this.channel4VolumeShifter;
                    this.channel4envelopeSweeps = this.channel4envelopeSweepsLast;
                    this.channel4UpdateCache();
                } else {
                    this.channel4envelopeSweepsLast = -1;
                }
            } else if (this.channel4envelopeVolume < 15) {
                this.channel4currentVolume = ++this.channel4envelopeVolume << this.channel4VolumeShifter;
                this.channel4envelopeSweeps = this.channel4envelopeSweepsLast;
                this.channel4UpdateCache();
            } else {
                this.channel4envelopeSweepsLast = -1;
            }
        }
    }
});
GameBoyCore.prototype.computeAudioChannels = _wrap_(function () {
    if (--this.channel1FrequencyCounter == 0) {
        this.channel1FrequencyCounter = this.channel1FrequencyTracker;
        this.channel1DutyTracker = this.channel1DutyTracker + 1 & 7;
        this.channel1OutputLevelTrimaryCache();
    }
    if (--this.channel2FrequencyCounter == 0) {
        this.channel2FrequencyCounter = this.channel2FrequencyTracker;
        this.channel2DutyTracker = this.channel2DutyTracker + 1 & 7;
        this.channel2OutputLevelTrimaryCache();
    }
    if (--this.channel3Counter == 0) {
        if (this.channel3canPlay) {
            this.channel3lastSampleLookup = this.channel3lastSampleLookup + 1 & 31;
        }
        this.channel3Counter = this.channel3FrequencyPeriod;
        this.channel3UpdateCache();
    }
    if (--this.channel4Counter == 0) {
        this.channel4lastSampleLookup = this.channel4lastSampleLookup + 1 & this.channel4BitRange;
        this.channel4Counter = this.channel4FrequencyPeriod;
        this.channel4UpdateCache();
    }
});
GameBoyCore.prototype.channel1EnableCheck = _wrap_(function () {
    this.channel1Enabled = (this.channel1consecutive || this.channel1totalLength > 0) && !this.channel1SweepFault && this.channel1canPlay;
    this.channel1OutputLevelSecondaryCache();
});
GameBoyCore.prototype.channel1VolumeEnableCheck = _wrap_(function () {
    this.channel1canPlay = this.memory[65298] > 7;
    this.channel1EnableCheck();
    this.channel1OutputLevelSecondaryCache();
});
GameBoyCore.prototype.channel1OutputLevelCache = _wrap_(function () {
    this.channel1currentSampleLeft = this.leftChannel1 ? this.channel1envelopeVolume : 0;
    this.channel1currentSampleRight = this.rightChannel1 ? this.channel1envelopeVolume : 0;
    this.channel1OutputLevelSecondaryCache();
});
GameBoyCore.prototype.channel1OutputLevelSecondaryCache = _wrap_(function () {
    if (this.channel1Enabled) {
        this.channel1currentSampleLeftSecondary = this.channel1currentSampleLeft;
        this.channel1currentSampleRightSecondary = this.channel1currentSampleRight;
    } else {
        this.channel1currentSampleLeftSecondary = 0;
        this.channel1currentSampleRightSecondary = 0;
    }
    this.channel1OutputLevelTrimaryCache();
});
GameBoyCore.prototype.channel1OutputLevelTrimaryCache = _wrap_(function () {
    if (this.channel1CachedDuty[this.channel1DutyTracker]) {
        this.channel1currentSampleLeftTrimary = this.channel1currentSampleLeftSecondary;
        this.channel1currentSampleRightTrimary = this.channel1currentSampleRightSecondary;
    } else {
        this.channel1currentSampleLeftTrimary = 0;
        this.channel1currentSampleRightTrimary = 0;
    }
    this.mixerOutputLevelCache();
});
GameBoyCore.prototype.channel2EnableCheck = _wrap_(function () {
    this.channel2Enabled = (this.channel2consecutive || this.channel2totalLength > 0) && this.channel2canPlay;
    this.channel2OutputLevelSecondaryCache();
});
GameBoyCore.prototype.channel2VolumeEnableCheck = _wrap_(function () {
    this.channel2canPlay = this.memory[65303] > 7;
    this.channel2EnableCheck();
    this.channel2OutputLevelSecondaryCache();
});
GameBoyCore.prototype.channel2OutputLevelCache = _wrap_(function () {
    this.channel2currentSampleLeft = this.leftChannel2 ? this.channel2envelopeVolume : 0;
    this.channel2currentSampleRight = this.rightChannel2 ? this.channel2envelopeVolume : 0;
    this.channel2OutputLevelSecondaryCache();
});
GameBoyCore.prototype.channel2OutputLevelSecondaryCache = _wrap_(function () {
    if (this.channel2Enabled) {
        this.channel2currentSampleLeftSecondary = this.channel2currentSampleLeft;
        this.channel2currentSampleRightSecondary = this.channel2currentSampleRight;
    } else {
        this.channel2currentSampleLeftSecondary = 0;
        this.channel2currentSampleRightSecondary = 0;
    }
    this.channel2OutputLevelTrimaryCache();
});
GameBoyCore.prototype.channel2OutputLevelTrimaryCache = _wrap_(function () {
    if (this.channel2CachedDuty[this.channel2DutyTracker]) {
        this.channel2currentSampleLeftTrimary = this.channel2currentSampleLeftSecondary;
        this.channel2currentSampleRightTrimary = this.channel2currentSampleRightSecondary;
    } else {
        this.channel2currentSampleLeftTrimary = 0;
        this.channel2currentSampleRightTrimary = 0;
    }
    this.mixerOutputLevelCache();
});
GameBoyCore.prototype.channel3EnableCheck = _wrap_(function () {
    this.channel3Enabled = this.channel3consecutive || this.channel3totalLength > 0;
    this.channel3OutputLevelSecondaryCache();
});
GameBoyCore.prototype.channel3OutputLevelCache = _wrap_(function () {
    this.channel3currentSampleLeft = this.leftChannel3 ? this.cachedChannel3Sample : 0;
    this.channel3currentSampleRight = this.rightChannel3 ? this.cachedChannel3Sample : 0;
    this.channel3OutputLevelSecondaryCache();
});
GameBoyCore.prototype.channel3OutputLevelSecondaryCache = _wrap_(function () {
    if (this.channel3Enabled) {
        this.channel3currentSampleLeftSecondary = this.channel3currentSampleLeft;
        this.channel3currentSampleRightSecondary = this.channel3currentSampleRight;
    } else {
        this.channel3currentSampleLeftSecondary = 0;
        this.channel3currentSampleRightSecondary = 0;
    }
    this.mixerOutputLevelCache();
});
GameBoyCore.prototype.channel4EnableCheck = _wrap_(function () {
    this.channel4Enabled = (this.channel4consecutive || this.channel4totalLength > 0) && this.channel4canPlay;
    this.channel4OutputLevelSecondaryCache();
});
GameBoyCore.prototype.channel4VolumeEnableCheck = _wrap_(function () {
    this.channel4canPlay = this.memory[65313] > 7;
    this.channel4EnableCheck();
    this.channel4OutputLevelSecondaryCache();
});
GameBoyCore.prototype.channel4OutputLevelCache = _wrap_(function () {
    this.channel4currentSampleLeft = this.leftChannel4 ? this.cachedChannel4Sample : 0;
    this.channel4currentSampleRight = this.rightChannel4 ? this.cachedChannel4Sample : 0;
    this.channel4OutputLevelSecondaryCache();
});
GameBoyCore.prototype.channel4OutputLevelSecondaryCache = _wrap_(function () {
    if (this.channel4Enabled) {
        this.channel4currentSampleLeftSecondary = this.channel4currentSampleLeft;
        this.channel4currentSampleRightSecondary = this.channel4currentSampleRight;
    } else {
        this.channel4currentSampleLeftSecondary = 0;
        this.channel4currentSampleRightSecondary = 0;
    }
    this.mixerOutputLevelCache();
});
GameBoyCore.prototype.mixerOutputLevelCache = _wrap_(function () {
    this.mixerOutputCache = ((this.channel1currentSampleLeftTrimary + this.channel2currentSampleLeftTrimary + this.channel3currentSampleLeftSecondary + this.channel4currentSampleLeftSecondary) * this.VinLeftChannelMasterVolume << 9) + (this.channel1currentSampleRightTrimary + this.channel2currentSampleRightTrimary + this.channel3currentSampleRightSecondary + this.channel4currentSampleRightSecondary) * this.VinRightChannelMasterVolume;
});
GameBoyCore.prototype.channel3UpdateCache = _wrap_(function () {
    this.cachedChannel3Sample = this.channel3PCM[this.channel3lastSampleLookup] >> this.channel3patternType;
    this.channel3OutputLevelCache();
});
GameBoyCore.prototype.channel3WriteRAM = _wrap_(function (address, data) {
    if (this.channel3canPlay) {
        this.audioJIT();
    }
    this.memory[65328 | address] = data;
    address <<= 1;
    this.channel3PCM[address] = data >> 4;
    this.channel3PCM[address | 1] = data & 15;
});
GameBoyCore.prototype.channel4UpdateCache = _wrap_(function () {
    this.cachedChannel4Sample = this.noiseSampleTable[this.channel4currentVolume | this.channel4lastSampleLookup];
    this.channel4OutputLevelCache();
});
GameBoyCore.prototype.run = _wrap_(function () {
    if ((this.stopEmulator & 2) == 0) {
        if ((this.stopEmulator & 1) == 1) {
            if (!this.CPUStopped) {
                this.stopEmulator = 0;
                this.drewFrame = false;
                this.audioUnderrunAdjustment();
                this.clockUpdate();
                if (!this.halt) {
                    this.executeIteration();
                } else {
                    this.CPUTicks = 0;
                    this.calculateHALTPeriod();
                    if (this.halt) {
                        this.updateCoreFull();
                    } else {
                        this.executeIteration();
                    }
                }
                this.requestDraw();
            } else {
                this.audioUnderrunAdjustment();
                this.audioTicks += this.CPUCyclesTotal;
                this.audioJIT();
                this.stopEmulator |= 1;
            }
        } else {
            cout('Iterator restarted a faulted core.', 2);
            pause();
        }
    }
});
GameBoyCore.prototype.executeIteration = _wrap_(function () {
    var opcodeToExecute = 0;
    var timedTicks = 0;
    while (this.stopEmulator == 0) {
        switch (this.IRQEnableDelay) {
        case 1:
            this.IME = true;
            this.checkIRQMatching();
        case 2:
            --this.IRQEnableDelay;
        }
        if (this.IRQLineMatched > 0) {
            this.launchIRQ();
        }
        opcodeToExecute = this.memoryReader[this.programCounter](this, this.programCounter);
        this.programCounter = this.programCounter + 1 & 65535;
        if (this.skipPCIncrement) {
            this.programCounter = this.programCounter - 1 & 65535;
            this.skipPCIncrement = false;
        }
        this.CPUTicks = this.TICKTable[opcodeToExecute];
        this.OPCODE[opcodeToExecute](this);
        this.LCDTicks += this.CPUTicks >> this.doubleSpeedShifter;
        this.LCDCONTROL[this.actualScanLine](this);
        timedTicks = this.CPUTicks >> this.doubleSpeedShifter;
        this.audioTicks += timedTicks;
        this.emulatorTicks += timedTicks;
        this.DIVTicks += this.CPUTicks;
        if (this.TIMAEnabled) {
            this.timerTicks += this.CPUTicks;
            while (this.timerTicks >= this.TACClocker) {
                this.timerTicks -= this.TACClocker;
                if (++this.memory[65285] == 256) {
                    this.memory[65285] = this.memory[65286];
                    this.interruptsRequested |= 4;
                    this.checkIRQMatching();
                }
            }
        }
        if (this.serialTimer > 0) {
            this.serialTimer -= this.CPUTicks;
            if (this.serialTimer <= 0) {
                this.interruptsRequested |= 8;
                this.checkIRQMatching();
            }
            this.serialShiftTimer -= this.CPUTicks;
            if (this.serialShiftTimer <= 0) {
                this.serialShiftTimer = this.serialShiftTimerAllocated;
                this.memory[65281] = this.memory[65281] << 1 & 254 | 1;
            }
        }
        if (this.emulatorTicks >= this.CPUCyclesTotal) {
            this.iterationEndRoutine();
        }
        this.instructions += 1;
        if (this.instructions > this.totalInstructions) {
            this.iterationEndRoutine();
            this.stopEmulator |= 2;
            checkFinalState();
        }
    }
});
GameBoyCore.prototype.iterationEndRoutine = _wrap_(function () {
    if ((this.stopEmulator & 1) == 0) {
        this.audioJIT();
        this.memory[65284] = this.memory[65284] + (this.DIVTicks >> 8) & 255;
        this.DIVTicks &= 255;
        this.stopEmulator |= 1;
        this.emulatorTicks -= this.CPUCyclesTotal;
        this.CPUCyclesTotalCurrent += this.CPUCyclesTotalRoundoff;
        this.recalculateIterationClockLimit();
    }
});
GameBoyCore.prototype.handleSTOP = _wrap_(function () {
    this.CPUStopped = true;
    this.iterationEndRoutine();
    if (this.emulatorTicks < 0) {
        this.audioTicks -= this.emulatorTicks;
        this.audioJIT();
    }
});
GameBoyCore.prototype.recalculateIterationClockLimit = _wrap_(function () {
    var endModulus = this.CPUCyclesTotalCurrent % 4;
    this.CPUCyclesTotal = this.CPUCyclesTotalBase + this.CPUCyclesTotalCurrent - endModulus;
    this.CPUCyclesTotalCurrent = endModulus;
});
GameBoyCore.prototype.scanLineMode2 = _wrap_(function () {
    if (this.STATTracker != 1) {
        if (this.mode2TriggerSTAT) {
            this.interruptsRequested |= 2;
            this.checkIRQMatching();
        }
        this.STATTracker = 1;
        this.modeSTAT = 2;
    }
});
GameBoyCore.prototype.scanLineMode3 = _wrap_(function () {
    if (this.modeSTAT != 3) {
        if (this.STATTracker == 0 && this.mode2TriggerSTAT) {
            this.interruptsRequested |= 2;
            this.checkIRQMatching();
        }
        this.STATTracker = 1;
        this.modeSTAT = 3;
    }
});
GameBoyCore.prototype.scanLineMode0 = _wrap_(function () {
    if (this.modeSTAT != 0) {
        if (this.STATTracker != 2) {
            if (this.STATTracker == 0) {
                if (this.mode2TriggerSTAT) {
                    this.interruptsRequested |= 2;
                    this.checkIRQMatching();
                }
                this.modeSTAT = 3;
            }
            this.incrementScanLineQueue();
            this.updateSpriteCount(this.actualScanLine);
            this.STATTracker = 2;
        }
        if (this.LCDTicks >= this.spriteCount) {
            if (this.hdmaRunning) {
                this.executeHDMA();
            }
            if (this.mode0TriggerSTAT) {
                this.interruptsRequested |= 2;
                this.checkIRQMatching();
            }
            this.STATTracker = 3;
            this.modeSTAT = 0;
        }
    }
});
GameBoyCore.prototype.clocksUntilLYCMatch = _wrap_(function () {
    if (this.memory[65349] != 0) {
        if (this.memory[65349] > this.actualScanLine) {
            return 456 * (this.memory[65349] - this.actualScanLine);
        }
        return 456 * (154 - this.actualScanLine + this.memory[65349]);
    }
    return 456 * (this.actualScanLine == 153 && this.memory[65348] == 0 ? 154 : 153 - this.actualScanLine) + 8;
});
GameBoyCore.prototype.clocksUntilMode0 = _wrap_(function () {
    switch (this.modeSTAT) {
    case 0:
        if (this.actualScanLine == 143) {
            this.updateSpriteCount(0);
            return this.spriteCount + 5016;
        }
        this.updateSpriteCount(this.actualScanLine + 1);
        return this.spriteCount + 456;
    case 2:
    case 3:
        this.updateSpriteCount(this.actualScanLine);
        return this.spriteCount;
    case 1:
        this.updateSpriteCount(0);
        return this.spriteCount + 456 * (154 - this.actualScanLine);
    }
});
GameBoyCore.prototype.updateSpriteCount = _wrap_(function (line) {
    this.spriteCount = 252;
    if (this.cGBC && this.gfxSpriteShow) {
        var lineAdjusted = line + 16;
        var yoffset = 0;
        var yCap = this.gfxSpriteNormalHeight ? 8 : 16;
        for (var OAMAddress = 65024; OAMAddress < 65184 && this.spriteCount < 312; OAMAddress += 4) {
            yoffset = lineAdjusted - this.memory[OAMAddress];
            if (yoffset > -1 && yoffset < yCap) {
                this.spriteCount += 6;
            }
        }
    }
});
GameBoyCore.prototype.matchLYC = _wrap_(function () {
    if (this.memory[65348] == this.memory[65349]) {
        this.memory[65345] |= 4;
        if (this.LYCMatchTriggerSTAT) {
            this.interruptsRequested |= 2;
            this.checkIRQMatching();
        }
    } else {
        this.memory[65345] &= 123;
    }
});
GameBoyCore.prototype.updateCore = _wrap_(function () {
    this.LCDTicks += this.CPUTicks >> this.doubleSpeedShifter;
    this.LCDCONTROL[this.actualScanLine](this);
    var timedTicks = this.CPUTicks >> this.doubleSpeedShifter;
    this.audioTicks += timedTicks;
    this.emulatorTicks += timedTicks;
    this.DIVTicks += this.CPUTicks;
    if (this.TIMAEnabled) {
        this.timerTicks += this.CPUTicks;
        while (this.timerTicks >= this.TACClocker) {
            this.timerTicks -= this.TACClocker;
            if (++this.memory[65285] == 256) {
                this.memory[65285] = this.memory[65286];
                this.interruptsRequested |= 4;
                this.checkIRQMatching();
            }
        }
    }
    if (this.serialTimer > 0) {
        this.serialTimer -= this.CPUTicks;
        if (this.serialTimer <= 0) {
            this.interruptsRequested |= 8;
            this.checkIRQMatching();
        }
        this.serialShiftTimer -= this.CPUTicks;
        if (this.serialShiftTimer <= 0) {
            this.serialShiftTimer = this.serialShiftTimerAllocated;
            this.memory[65281] = this.memory[65281] << 1 & 254 | 1;
        }
    }
});
GameBoyCore.prototype.updateCoreFull = _wrap_(function () {
    this.updateCore();
    if (this.emulatorTicks >= this.CPUCyclesTotal) {
        this.iterationEndRoutine();
    }
});
GameBoyCore.prototype.initializeLCDController = _wrap_(function () {
    var line = 0;
    while (line < 154) {
        if (line < 143) {
            this.LINECONTROL[line] = _wrap_(function (parentObj) {
                if (parentObj.LCDTicks < 80) {
                    parentObj.scanLineMode2();
                } else if (parentObj.LCDTicks < 252) {
                    parentObj.scanLineMode3();
                } else if (parentObj.LCDTicks < 456) {
                    parentObj.scanLineMode0();
                } else {
                    parentObj.LCDTicks -= 456;
                    if (parentObj.STATTracker != 3) {
                        if (parentObj.STATTracker != 2) {
                            if (parentObj.STATTracker == 0 && parentObj.mode2TriggerSTAT) {
                                parentObj.interruptsRequested |= 2;
                            }
                            parentObj.incrementScanLineQueue();
                        }
                        if (parentObj.hdmaRunning) {
                            parentObj.executeHDMA();
                        }
                        if (parentObj.mode0TriggerSTAT) {
                            parentObj.interruptsRequested |= 2;
                        }
                    }
                    parentObj.actualScanLine = ++parentObj.memory[65348];
                    if (parentObj.actualScanLine == parentObj.memory[65349]) {
                        parentObj.memory[65345] |= 4;
                        if (parentObj.LYCMatchTriggerSTAT) {
                            parentObj.interruptsRequested |= 2;
                        }
                    } else {
                        parentObj.memory[65345] &= 123;
                    }
                    parentObj.checkIRQMatching();
                    parentObj.STATTracker = 0;
                    parentObj.modeSTAT = 2;
                    parentObj.LINECONTROL[parentObj.actualScanLine](parentObj);
                }
            });
        } else if (line == 143) {
            this.LINECONTROL[143] = _wrap_(function (parentObj) {
                if (parentObj.LCDTicks < 80) {
                    parentObj.scanLineMode2();
                } else if (parentObj.LCDTicks < 252) {
                    parentObj.scanLineMode3();
                } else if (parentObj.LCDTicks < 456) {
                    parentObj.scanLineMode0();
                } else {
                    parentObj.LCDTicks -= 456;
                    if (parentObj.STATTracker != 3) {
                        if (parentObj.STATTracker != 2) {
                            if (parentObj.STATTracker == 0 && parentObj.mode2TriggerSTAT) {
                                parentObj.interruptsRequested |= 2;
                            }
                            parentObj.incrementScanLineQueue();
                        }
                        if (parentObj.hdmaRunning) {
                            parentObj.executeHDMA();
                        }
                        if (parentObj.mode0TriggerSTAT) {
                            parentObj.interruptsRequested |= 2;
                        }
                    }
                    parentObj.actualScanLine = parentObj.memory[65348] = 144;
                    if (parentObj.memory[65349] == 144) {
                        parentObj.memory[65345] |= 4;
                        if (parentObj.LYCMatchTriggerSTAT) {
                            parentObj.interruptsRequested |= 2;
                        }
                    } else {
                        parentObj.memory[65345] &= 123;
                    }
                    parentObj.STATTracker = 0;
                    parentObj.modeSTAT = 1;
                    parentObj.interruptsRequested |= parentObj.mode1TriggerSTAT ? 3 : 1;
                    parentObj.checkIRQMatching();
                    if (parentObj.drewBlank == 0) {
                        if (parentObj.totalLinesPassed < 144 || parentObj.totalLinesPassed == 144 && parentObj.midScanlineOffset > -1) {
                            parentObj.graphicsJITVBlank();
                            parentObj.prepareFrame();
                        }
                    } else {
                        --parentObj.drewBlank;
                    }
                    parentObj.LINECONTROL[144](parentObj);
                }
            });
        } else if (line < 153) {
            this.LINECONTROL[line] = _wrap_(function (parentObj) {
                if (parentObj.LCDTicks >= 456) {
                    parentObj.LCDTicks -= 456;
                    parentObj.actualScanLine = ++parentObj.memory[65348];
                    if (parentObj.actualScanLine == parentObj.memory[65349]) {
                        parentObj.memory[65345] |= 4;
                        if (parentObj.LYCMatchTriggerSTAT) {
                            parentObj.interruptsRequested |= 2;
                            parentObj.checkIRQMatching();
                        }
                    } else {
                        parentObj.memory[65345] &= 123;
                    }
                    parentObj.LINECONTROL[parentObj.actualScanLine](parentObj);
                }
            });
        } else {
            this.LINECONTROL[153] = _wrap_(function (parentObj) {
                if (parentObj.LCDTicks >= 8) {
                    if (parentObj.STATTracker != 4 && parentObj.memory[65348] == 153) {
                        parentObj.memory[65348] = 0;
                        if (parentObj.memory[65349] == 0) {
                            parentObj.memory[65345] |= 4;
                            if (parentObj.LYCMatchTriggerSTAT) {
                                parentObj.interruptsRequested |= 2;
                                parentObj.checkIRQMatching();
                            }
                        } else {
                            parentObj.memory[65345] &= 123;
                        }
                        parentObj.STATTracker = 4;
                    }
                    if (parentObj.LCDTicks >= 456) {
                        parentObj.LCDTicks -= 456;
                        parentObj.STATTracker = parentObj.actualScanLine = 0;
                        parentObj.LINECONTROL[0](parentObj);
                    }
                }
            });
        }
        ++line;
    }
});
GameBoyCore.prototype.DisplayShowOff = _wrap_(function () {
    if (this.drewBlank == 0) {
        this.clearFrameBuffer();
        this.drewFrame = true;
    }
    this.drewBlank = 2;
});
GameBoyCore.prototype.executeHDMA = _wrap_(function () {
    this.DMAWrite(1);
    if (this.halt) {
        if (this.LCDTicks - this.spriteCount < (4 >> this.doubleSpeedShifter | 32)) {
            this.CPUTicks = 4 + (32 + this.spriteCount << this.doubleSpeedShifter);
            this.LCDTicks = this.spriteCount + (4 >> this.doubleSpeedShifter | 32);
        }
    } else {
        this.LCDTicks += 4 >> this.doubleSpeedShifter | 32;
    }
    if (this.memory[65365] == 0) {
        this.hdmaRunning = false;
        this.memory[65365] = 255;
    } else {
        --this.memory[65365];
    }
});
GameBoyCore.prototype.clockUpdate = _wrap_(function () {
    if (this.cTIMER) {
        var dateObj = new_Date();
        var newTime = dateObj.getTime();
        var timeElapsed = newTime - this.lastIteration;
        this.lastIteration = newTime;
        if (this.cTIMER && !this.RTCHALT) {
            this.RTCSeconds += timeElapsed / 1000;
            while (this.RTCSeconds >= 60) {
                this.RTCSeconds -= 60;
                ++this.RTCMinutes;
                if (this.RTCMinutes >= 60) {
                    this.RTCMinutes -= 60;
                    ++this.RTCHours;
                    if (this.RTCHours >= 24) {
                        this.RTCHours -= 24;
                        ++this.RTCDays;
                        if (this.RTCDays >= 512) {
                            this.RTCDays -= 512;
                            this.RTCDayOverFlow = true;
                        }
                    }
                }
            }
        }
    }
});
GameBoyCore.prototype.prepareFrame = _wrap_(function () {
    this.swizzleFrameBuffer();
    this.drewFrame = true;
});
GameBoyCore.prototype.requestDraw = _wrap_(function () {
    if (this.drewFrame) {
        this.dispatchDraw();
    }
});
GameBoyCore.prototype.dispatchDraw = _wrap_(function () {
    var canvasRGBALength = this.offscreenRGBCount;
    if (canvasRGBALength > 0) {
        var frameBuffer = canvasRGBALength == 92160 ? this.swizzledFrame : this.resizeFrameBuffer();
        var canvasData = this.canvasBuffer.data;
        var bufferIndex = 0;
        for (var canvasIndex = 0; canvasIndex < canvasRGBALength; ++canvasIndex) {
            canvasData[canvasIndex++] = frameBuffer[bufferIndex++];
            canvasData[canvasIndex++] = frameBuffer[bufferIndex++];
            canvasData[canvasIndex++] = frameBuffer[bufferIndex++];
        }
        this.graphicsBlit();
    }
});
GameBoyCore.prototype.swizzleFrameBuffer = _wrap_(function () {
    var frameBuffer = this.frameBuffer;
    var swizzledFrame = this.swizzledFrame;
    var bufferIndex = 0;
    for (var canvasIndex = 0; canvasIndex < 69120;) {
        swizzledFrame[canvasIndex++] = frameBuffer[bufferIndex] >> 16 & 255;
        swizzledFrame[canvasIndex++] = frameBuffer[bufferIndex] >> 8 & 255;
        swizzledFrame[canvasIndex++] = frameBuffer[bufferIndex++] & 255;
    }
});
GameBoyCore.prototype.clearFrameBuffer = _wrap_(function () {
    var bufferIndex = 0;
    var frameBuffer = this.swizzledFrame;
    if (this.cGBC || this.colorizedGBPalettes) {
        while (bufferIndex < 69120) {
            frameBuffer[bufferIndex++] = 248;
        }
    } else {
        while (bufferIndex < 69120) {
            frameBuffer[bufferIndex++] = 239;
            frameBuffer[bufferIndex++] = 255;
            frameBuffer[bufferIndex++] = 222;
        }
    }
});
GameBoyCore.prototype.resizeFrameBuffer = _wrap_(function () {
    return this.resizer.resize(this.swizzledFrame);
});
GameBoyCore.prototype.compileResizeFrameBufferFunction = _wrap_(function () {
    if (this.offscreenRGBCount > 0) {
        this.resizer = new Resize(160, 144, this.offscreenWidth, this.offscreenHeight, false, true);
    }
});
GameBoyCore.prototype.renderScanLine = _wrap_(function (scanlineToRender) {
    this.pixelStart = scanlineToRender * 160;
    if (this.bgEnabled) {
        this.pixelEnd = 160;
        this.BGLayerRender(scanlineToRender);
        this.WindowLayerRender(scanlineToRender);
    } else {
        var pixelLine = (scanlineToRender + 1) * 160;
        var defaultColor = this.cGBC || this.colorizedGBPalettes ? 16316664 : 15728606;
        for (var pixelPosition = scanlineToRender * 160 + this.currentX; pixelPosition < pixelLine; pixelPosition++) {
            this.frameBuffer[pixelPosition] = defaultColor;
        }
    }
    this.SpriteLayerRender(scanlineToRender);
    this.currentX = 0;
    this.midScanlineOffset = -1;
});
GameBoyCore.prototype.renderMidScanLine = _wrap_(function () {
    if (this.actualScanLine < 144 && this.modeSTAT == 3) {
        if (this.midScanlineOffset == -1) {
            this.midScanlineOffset = this.backgroundX & 7;
        }
        if (this.LCDTicks >= 82) {
            this.pixelEnd = this.LCDTicks - 74;
            this.pixelEnd = Math.min(this.pixelEnd - this.midScanlineOffset - this.pixelEnd % 8, 160);
            if (this.bgEnabled) {
                this.pixelStart = this.lastUnrenderedLine * 160;
                this.BGLayerRender(this.lastUnrenderedLine);
                this.WindowLayerRender(this.lastUnrenderedLine);
            } else {
                var pixelLine = this.lastUnrenderedLine * 160 + this.pixelEnd;
                var defaultColor = this.cGBC || this.colorizedGBPalettes ? 16316664 : 15728606;
                for (var pixelPosition = this.lastUnrenderedLine * 160 + this.currentX; pixelPosition < pixelLine; pixelPosition++) {
                    this.frameBuffer[pixelPosition] = defaultColor;
                }
            }
            this.currentX = this.pixelEnd;
        }
    }
});
GameBoyCore.prototype.initializeModeSpecificArrays = _wrap_(function () {
    this.LCDCONTROL = this.LCDisOn ? this.LINECONTROL : this.DISPLAYOFFCONTROL;
    if (this.cGBC) {
        this.gbcOBJRawPalette = this.getTypedArray(64, 0, 'uint8');
        this.gbcBGRawPalette = this.getTypedArray(64, 0, 'uint8');
        this.gbcOBJPalette = this.getTypedArray(32, 16777216, 'int32');
        this.gbcBGPalette = this.getTypedArray(64, 0, 'int32');
        this.BGCHRBank2 = this.getTypedArray(2048, 0, 'uint8');
        this.BGCHRCurrentBank = this.currVRAMBank > 0 ? this.BGCHRBank2 : this.BGCHRBank1;
        this.tileCache = this.generateCacheArray(3968);
    } else {
        this.gbOBJPalette = this.getTypedArray(8, 0, 'int32');
        this.gbBGPalette = this.getTypedArray(4, 0, 'int32');
        this.BGPalette = this.gbBGPalette;
        this.OBJPalette = this.gbOBJPalette;
        this.tileCache = this.generateCacheArray(1792);
        this.sortBuffer = this.getTypedArray(256, 0, 'uint8');
        this.OAMAddressCache = this.getTypedArray(10, 0, 'int32');
    }
    this.renderPathBuild();
});
GameBoyCore.prototype.GBCtoGBModeAdjust = _wrap_(function () {
    cout('Stepping down from GBC mode.', 0);
    this.VRAM = this.GBCMemory = this.BGCHRCurrentBank = this.BGCHRBank2 = null;
    this.tileCache.length = 1792;
    if (settings[4]) {
        this.gbBGColorizedPalette = this.getTypedArray(4, 0, 'int32');
        this.gbOBJColorizedPalette = this.getTypedArray(8, 0, 'int32');
        this.cachedBGPaletteConversion = this.getTypedArray(4, 0, 'int32');
        this.cachedOBJPaletteConversion = this.getTypedArray(8, 0, 'int32');
        this.BGPalette = this.gbBGColorizedPalette;
        this.OBJPalette = this.gbOBJColorizedPalette;
        this.gbOBJPalette = this.gbBGPalette = null;
        this.getGBCColor();
    } else {
        this.gbOBJPalette = this.getTypedArray(8, 0, 'int32');
        this.gbBGPalette = this.getTypedArray(4, 0, 'int32');
        this.BGPalette = this.gbBGPalette;
        this.OBJPalette = this.gbOBJPalette;
    }
    this.sortBuffer = this.getTypedArray(256, 0, 'uint8');
    this.OAMAddressCache = this.getTypedArray(10, 0, 'int32');
    this.renderPathBuild();
    this.memoryReadJumpCompile();
    this.memoryWriteJumpCompile();
});
GameBoyCore.prototype.renderPathBuild = _wrap_(function () {
    if (!this.cGBC) {
        this.BGLayerRender = this.BGGBLayerRender;
        this.WindowLayerRender = this.WindowGBLayerRender;
        this.SpriteLayerRender = this.SpriteGBLayerRender;
    } else {
        this.priorityFlaggingPathRebuild();
        this.SpriteLayerRender = this.SpriteGBCLayerRender;
    }
});
GameBoyCore.prototype.priorityFlaggingPathRebuild = _wrap_(function () {
    if (this.BGPriorityEnabled) {
        this.BGLayerRender = this.BGGBCLayerRender;
        this.WindowLayerRender = this.WindowGBCLayerRender;
    } else {
        this.BGLayerRender = this.BGGBCLayerRenderNoPriorityFlagging;
        this.WindowLayerRender = this.WindowGBCLayerRenderNoPriorityFlagging;
    }
});
GameBoyCore.prototype.initializeReferencesFromSaveState = _wrap_(function () {
    this.LCDCONTROL = this.LCDisOn ? this.LINECONTROL : this.DISPLAYOFFCONTROL;
    var tileIndex = 0;
    if (!this.cGBC) {
        if (this.colorizedGBPalettes) {
            this.BGPalette = this.gbBGColorizedPalette;
            this.OBJPalette = this.gbOBJColorizedPalette;
            this.updateGBBGPalette = this.updateGBColorizedBGPalette;
            this.updateGBOBJPalette = this.updateGBColorizedOBJPalette;
        } else {
            this.BGPalette = this.gbBGPalette;
            this.OBJPalette = this.gbOBJPalette;
        }
        this.tileCache = this.generateCacheArray(1792);
        for (tileIndex = 32768; tileIndex < 36864; tileIndex += 2) {
            this.generateGBOAMTileLine(tileIndex);
        }
        for (tileIndex = 36864; tileIndex < 38912; tileIndex += 2) {
            this.generateGBTileLine(tileIndex);
        }
        this.sortBuffer = this.getTypedArray(256, 0, 'uint8');
        this.OAMAddressCache = this.getTypedArray(10, 0, 'int32');
    } else {
        this.BGCHRCurrentBank = this.currVRAMBank > 0 ? this.BGCHRBank2 : this.BGCHRBank1;
        this.tileCache = this.generateCacheArray(3968);
        for (; tileIndex < 6144; tileIndex += 16) {
            this.generateGBCTileBank1(tileIndex);
            this.generateGBCTileBank2(tileIndex);
        }
    }
    this.renderPathBuild();
});
GameBoyCore.prototype.RGBTint = _wrap_(function (value) {
    var r = value & 31;
    var g = value >> 5 & 31;
    var b = value >> 10 & 31;
    return r * 13 + g * 2 + b >> 1 << 16 | g * 3 + b << 9 | r * 3 + g * 2 + b * 11 >> 1;
});
GameBoyCore.prototype.getGBCColor = _wrap_(function () {
    for (var counter = 0; counter < 4; counter++) {
        var adjustedIndex = counter << 1;
        this.cachedBGPaletteConversion[counter] = this.RGBTint(this.gbcBGRawPalette[adjustedIndex | 1] << 8 | this.gbcBGRawPalette[adjustedIndex]);
        this.cachedOBJPaletteConversion[counter] = this.RGBTint(this.gbcOBJRawPalette[adjustedIndex | 1] << 8 | this.gbcOBJRawPalette[adjustedIndex]);
    }
    for (counter = 4; counter < 8; counter++) {
        adjustedIndex = counter << 1;
        this.cachedOBJPaletteConversion[counter] = this.RGBTint(this.gbcOBJRawPalette[adjustedIndex | 1] << 8 | this.gbcOBJRawPalette[adjustedIndex]);
    }
    this.updateGBBGPalette = this.updateGBColorizedBGPalette;
    this.updateGBOBJPalette = this.updateGBColorizedOBJPalette;
    this.updateGBBGPalette(this.memory[65351]);
    this.updateGBOBJPalette(0, this.memory[65352]);
    this.updateGBOBJPalette(1, this.memory[65353]);
    this.colorizedGBPalettes = true;
});
GameBoyCore.prototype.updateGBRegularBGPalette = _wrap_(function (data) {
    this.gbBGPalette[0] = this.colors[data & 3] | 33554432;
    this.gbBGPalette[1] = this.colors[data >> 2 & 3];
    this.gbBGPalette[2] = this.colors[data >> 4 & 3];
    this.gbBGPalette[3] = this.colors[data >> 6];
});
GameBoyCore.prototype.updateGBColorizedBGPalette = _wrap_(function (data) {
    this.gbBGColorizedPalette[0] = this.cachedBGPaletteConversion[data & 3] | 33554432;
    this.gbBGColorizedPalette[1] = this.cachedBGPaletteConversion[data >> 2 & 3];
    this.gbBGColorizedPalette[2] = this.cachedBGPaletteConversion[data >> 4 & 3];
    this.gbBGColorizedPalette[3] = this.cachedBGPaletteConversion[data >> 6];
});
GameBoyCore.prototype.updateGBRegularOBJPalette = _wrap_(function (index, data) {
    this.gbOBJPalette[index | 1] = this.colors[data >> 2 & 3];
    this.gbOBJPalette[index | 2] = this.colors[data >> 4 & 3];
    this.gbOBJPalette[index | 3] = this.colors[data >> 6];
});
GameBoyCore.prototype.updateGBColorizedOBJPalette = _wrap_(function (index, data) {
    this.gbOBJColorizedPalette[index | 1] = this.cachedOBJPaletteConversion[index | data >> 2 & 3];
    this.gbOBJColorizedPalette[index | 2] = this.cachedOBJPaletteConversion[index | data >> 4 & 3];
    this.gbOBJColorizedPalette[index | 3] = this.cachedOBJPaletteConversion[index | data >> 6];
});
GameBoyCore.prototype.updateGBCBGPalette = _wrap_(function (index, data) {
    if (this.gbcBGRawPalette[index] != data) {
        this.midScanLineJIT();
        this.gbcBGRawPalette[index] = data;
        if ((index & 6) == 0) {
            data = 33554432 | this.RGBTint(this.gbcBGRawPalette[index | 1] << 8 | this.gbcBGRawPalette[index & 62]);
            index >>= 1;
            this.gbcBGPalette[index] = data;
            this.gbcBGPalette[32 | index] = 16777216 | data;
        } else {
            data = this.RGBTint(this.gbcBGRawPalette[index | 1] << 8 | this.gbcBGRawPalette[index & 62]);
            index >>= 1;
            this.gbcBGPalette[index] = data;
            this.gbcBGPalette[32 | index] = 16777216 | data;
        }
    }
});
GameBoyCore.prototype.updateGBCOBJPalette = _wrap_(function (index, data) {
    if (this.gbcOBJRawPalette[index] != data) {
        this.gbcOBJRawPalette[index] = data;
        if ((index & 6) > 0) {
            this.midScanLineJIT();
            this.gbcOBJPalette[index >> 1] = 16777216 | this.RGBTint(this.gbcOBJRawPalette[index | 1] << 8 | this.gbcOBJRawPalette[index & 62]);
        }
    }
});
GameBoyCore.prototype.BGGBLayerRender = _wrap_(function (scanlineToRender) {
    var scrollYAdjusted = this.backgroundY + scanlineToRender & 255;
    var tileYLine = (scrollYAdjusted & 7) << 3;
    var tileYDown = this.gfxBackgroundCHRBankPosition | (scrollYAdjusted & 248) << 2;
    var scrollXAdjusted = this.backgroundX + this.currentX & 255;
    var pixelPosition = this.pixelStart + this.currentX;
    var pixelPositionEnd = this.pixelStart + (this.gfxWindowDisplay && scanlineToRender - this.windowY >= 0 ? Math.min(Math.max(this.windowX, 0) + this.currentX, this.pixelEnd) : this.pixelEnd);
    var tileNumber = tileYDown + (scrollXAdjusted >> 3);
    var chrCode = this.BGCHRBank1[tileNumber];
    if (chrCode < this.gfxBackgroundBankOffset) {
        chrCode |= 256;
    }
    var tile = this.tileCache[chrCode];
    for (var texel = scrollXAdjusted & 7; texel < 8 && pixelPosition < pixelPositionEnd && scrollXAdjusted < 256; ++scrollXAdjusted) {
        this.frameBuffer[pixelPosition++] = this.BGPalette[tile[tileYLine | texel++]];
    }
    var scrollXAdjustedAligned = Math.min(pixelPositionEnd - pixelPosition, 256 - scrollXAdjusted) >> 3;
    scrollXAdjusted += scrollXAdjustedAligned << 3;
    scrollXAdjustedAligned += tileNumber;
    while (tileNumber < scrollXAdjustedAligned) {
        chrCode = this.BGCHRBank1[++tileNumber];
        if (chrCode < this.gfxBackgroundBankOffset) {
            chrCode |= 256;
        }
        tile = this.tileCache[chrCode];
        texel = tileYLine;
        this.frameBuffer[pixelPosition++] = this.BGPalette[tile[texel++]];
        this.frameBuffer[pixelPosition++] = this.BGPalette[tile[texel++]];
        this.frameBuffer[pixelPosition++] = this.BGPalette[tile[texel++]];
        this.frameBuffer[pixelPosition++] = this.BGPalette[tile[texel++]];
        this.frameBuffer[pixelPosition++] = this.BGPalette[tile[texel++]];
        this.frameBuffer[pixelPosition++] = this.BGPalette[tile[texel++]];
        this.frameBuffer[pixelPosition++] = this.BGPalette[tile[texel++]];
        this.frameBuffer[pixelPosition++] = this.BGPalette[tile[texel]];
    }
    if (pixelPosition < pixelPositionEnd) {
        if (scrollXAdjusted < 256) {
            chrCode = this.BGCHRBank1[++tileNumber];
            if (chrCode < this.gfxBackgroundBankOffset) {
                chrCode |= 256;
            }
            tile = this.tileCache[chrCode];
            for (texel = tileYLine - 1; pixelPosition < pixelPositionEnd && scrollXAdjusted < 256; ++scrollXAdjusted) {
                this.frameBuffer[pixelPosition++] = this.BGPalette[tile[++texel]];
            }
        }
        scrollXAdjustedAligned = (pixelPositionEnd - pixelPosition >> 3) + tileYDown;
        while (tileYDown < scrollXAdjustedAligned) {
            chrCode = this.BGCHRBank1[tileYDown++];
            if (chrCode < this.gfxBackgroundBankOffset) {
                chrCode |= 256;
            }
            tile = this.tileCache[chrCode];
            texel = tileYLine;
            this.frameBuffer[pixelPosition++] = this.BGPalette[tile[texel++]];
            this.frameBuffer[pixelPosition++] = this.BGPalette[tile[texel++]];
            this.frameBuffer[pixelPosition++] = this.BGPalette[tile[texel++]];
            this.frameBuffer[pixelPosition++] = this.BGPalette[tile[texel++]];
            this.frameBuffer[pixelPosition++] = this.BGPalette[tile[texel++]];
            this.frameBuffer[pixelPosition++] = this.BGPalette[tile[texel++]];
            this.frameBuffer[pixelPosition++] = this.BGPalette[tile[texel++]];
            this.frameBuffer[pixelPosition++] = this.BGPalette[tile[texel]];
        }
        if (pixelPosition < pixelPositionEnd) {
            chrCode = this.BGCHRBank1[tileYDown];
            if (chrCode < this.gfxBackgroundBankOffset) {
                chrCode |= 256;
            }
            tile = this.tileCache[chrCode];
            switch (pixelPositionEnd - pixelPosition) {
            case 7:
                this.frameBuffer[pixelPosition + 6] = this.BGPalette[tile[tileYLine | 6]];
            case 6:
                this.frameBuffer[pixelPosition + 5] = this.BGPalette[tile[tileYLine | 5]];
            case 5:
                this.frameBuffer[pixelPosition + 4] = this.BGPalette[tile[tileYLine | 4]];
            case 4:
                this.frameBuffer[pixelPosition + 3] = this.BGPalette[tile[tileYLine | 3]];
            case 3:
                this.frameBuffer[pixelPosition + 2] = this.BGPalette[tile[tileYLine | 2]];
            case 2:
                this.frameBuffer[pixelPosition + 1] = this.BGPalette[tile[tileYLine | 1]];
            case 1:
                this.frameBuffer[pixelPosition] = this.BGPalette[tile[tileYLine]];
            }
        }
    }
});
GameBoyCore.prototype.BGGBCLayerRender = _wrap_(function (scanlineToRender) {
    var scrollYAdjusted = this.backgroundY + scanlineToRender & 255;
    var tileYLine = (scrollYAdjusted & 7) << 3;
    var tileYDown = this.gfxBackgroundCHRBankPosition | (scrollYAdjusted & 248) << 2;
    var scrollXAdjusted = this.backgroundX + this.currentX & 255;
    var pixelPosition = this.pixelStart + this.currentX;
    var pixelPositionEnd = this.pixelStart + (this.gfxWindowDisplay && scanlineToRender - this.windowY >= 0 ? Math.min(Math.max(this.windowX, 0) + this.currentX, this.pixelEnd) : this.pixelEnd);
    var tileNumber = tileYDown + (scrollXAdjusted >> 3);
    var chrCode = this.BGCHRBank1[tileNumber];
    if (chrCode < this.gfxBackgroundBankOffset) {
        chrCode |= 256;
    }
    var attrCode = this.BGCHRBank2[tileNumber];
    var tile = this.tileCache[(attrCode & 8) << 8 | (attrCode & 96) << 4 | chrCode];
    var palette = (attrCode & 7) << 2 | (attrCode & 128) >> 2;
    for (var texel = scrollXAdjusted & 7; texel < 8 && pixelPosition < pixelPositionEnd && scrollXAdjusted < 256; ++scrollXAdjusted) {
        this.frameBuffer[pixelPosition++] = this.gbcBGPalette[palette | tile[tileYLine | texel++]];
    }
    var scrollXAdjustedAligned = Math.min(pixelPositionEnd - pixelPosition, 256 - scrollXAdjusted) >> 3;
    scrollXAdjusted += scrollXAdjustedAligned << 3;
    scrollXAdjustedAligned += tileNumber;
    while (tileNumber < scrollXAdjustedAligned) {
        chrCode = this.BGCHRBank1[++tileNumber];
        if (chrCode < this.gfxBackgroundBankOffset) {
            chrCode |= 256;
        }
        attrCode = this.BGCHRBank2[tileNumber];
        tile = this.tileCache[(attrCode & 8) << 8 | (attrCode & 96) << 4 | chrCode];
        palette = (attrCode & 7) << 2 | (attrCode & 128) >> 2;
        texel = tileYLine;
        this.frameBuffer[pixelPosition++] = this.gbcBGPalette[palette | tile[texel++]];
        this.frameBuffer[pixelPosition++] = this.gbcBGPalette[palette | tile[texel++]];
        this.frameBuffer[pixelPosition++] = this.gbcBGPalette[palette | tile[texel++]];
        this.frameBuffer[pixelPosition++] = this.gbcBGPalette[palette | tile[texel++]];
        this.frameBuffer[pixelPosition++] = this.gbcBGPalette[palette | tile[texel++]];
        this.frameBuffer[pixelPosition++] = this.gbcBGPalette[palette | tile[texel++]];
        this.frameBuffer[pixelPosition++] = this.gbcBGPalette[palette | tile[texel++]];
        this.frameBuffer[pixelPosition++] = this.gbcBGPalette[palette | tile[texel]];
    }
    if (pixelPosition < pixelPositionEnd) {
        if (scrollXAdjusted < 256) {
            chrCode = this.BGCHRBank1[++tileNumber];
            if (chrCode < this.gfxBackgroundBankOffset) {
                chrCode |= 256;
            }
            attrCode = this.BGCHRBank2[tileNumber];
            tile = this.tileCache[(attrCode & 8) << 8 | (attrCode & 96) << 4 | chrCode];
            palette = (attrCode & 7) << 2 | (attrCode & 128) >> 2;
            for (texel = tileYLine - 1; pixelPosition < pixelPositionEnd && scrollXAdjusted < 256; ++scrollXAdjusted) {
                this.frameBuffer[pixelPosition++] = this.gbcBGPalette[palette | tile[++texel]];
            }
        }
        scrollXAdjustedAligned = (pixelPositionEnd - pixelPosition >> 3) + tileYDown;
        while (tileYDown < scrollXAdjustedAligned) {
            chrCode = this.BGCHRBank1[tileYDown];
            if (chrCode < this.gfxBackgroundBankOffset) {
                chrCode |= 256;
            }
            attrCode = this.BGCHRBank2[tileYDown++];
            tile = this.tileCache[(attrCode & 8) << 8 | (attrCode & 96) << 4 | chrCode];
            palette = (attrCode & 7) << 2 | (attrCode & 128) >> 2;
            texel = tileYLine;
            this.frameBuffer[pixelPosition++] = this.gbcBGPalette[palette | tile[texel++]];
            this.frameBuffer[pixelPosition++] = this.gbcBGPalette[palette | tile[texel++]];
            this.frameBuffer[pixelPosition++] = this.gbcBGPalette[palette | tile[texel++]];
            this.frameBuffer[pixelPosition++] = this.gbcBGPalette[palette | tile[texel++]];
            this.frameBuffer[pixelPosition++] = this.gbcBGPalette[palette | tile[texel++]];
            this.frameBuffer[pixelPosition++] = this.gbcBGPalette[palette | tile[texel++]];
            this.frameBuffer[pixelPosition++] = this.gbcBGPalette[palette | tile[texel++]];
            this.frameBuffer[pixelPosition++] = this.gbcBGPalette[palette | tile[texel]];
        }
        if (pixelPosition < pixelPositionEnd) {
            chrCode = this.BGCHRBank1[tileYDown];
            if (chrCode < this.gfxBackgroundBankOffset) {
                chrCode |= 256;
            }
            attrCode = this.BGCHRBank2[tileYDown];
            tile = this.tileCache[(attrCode & 8) << 8 | (attrCode & 96) << 4 | chrCode];
            palette = (attrCode & 7) << 2 | (attrCode & 128) >> 2;
            switch (pixelPositionEnd - pixelPosition) {
            case 7:
                this.frameBuffer[pixelPosition + 6] = this.gbcBGPalette[palette | tile[tileYLine | 6]];
            case 6:
                this.frameBuffer[pixelPosition + 5] = this.gbcBGPalette[palette | tile[tileYLine | 5]];
            case 5:
                this.frameBuffer[pixelPosition + 4] = this.gbcBGPalette[palette | tile[tileYLine | 4]];
            case 4:
                this.frameBuffer[pixelPosition + 3] = this.gbcBGPalette[palette | tile[tileYLine | 3]];
            case 3:
                this.frameBuffer[pixelPosition + 2] = this.gbcBGPalette[palette | tile[tileYLine | 2]];
            case 2:
                this.frameBuffer[pixelPosition + 1] = this.gbcBGPalette[palette | tile[tileYLine | 1]];
            case 1:
                this.frameBuffer[pixelPosition] = this.gbcBGPalette[palette | tile[tileYLine]];
            }
        }
    }
});
GameBoyCore.prototype.BGGBCLayerRenderNoPriorityFlagging = _wrap_(function (scanlineToRender) {
    var scrollYAdjusted = this.backgroundY + scanlineToRender & 255;
    var tileYLine = (scrollYAdjusted & 7) << 3;
    var tileYDown = this.gfxBackgroundCHRBankPosition | (scrollYAdjusted & 248) << 2;
    var scrollXAdjusted = this.backgroundX + this.currentX & 255;
    var pixelPosition = this.pixelStart + this.currentX;
    var pixelPositionEnd = this.pixelStart + (this.gfxWindowDisplay && scanlineToRender - this.windowY >= 0 ? Math.min(Math.max(this.windowX, 0) + this.currentX, this.pixelEnd) : this.pixelEnd);
    var tileNumber = tileYDown + (scrollXAdjusted >> 3);
    var chrCode = this.BGCHRBank1[tileNumber];
    if (chrCode < this.gfxBackgroundBankOffset) {
        chrCode |= 256;
    }
    var attrCode = this.BGCHRBank2[tileNumber];
    var tile = this.tileCache[(attrCode & 8) << 8 | (attrCode & 96) << 4 | chrCode];
    var palette = (attrCode & 7) << 2;
    for (var texel = scrollXAdjusted & 7; texel < 8 && pixelPosition < pixelPositionEnd && scrollXAdjusted < 256; ++scrollXAdjusted) {
        this.frameBuffer[pixelPosition++] = this.gbcBGPalette[palette | tile[tileYLine | texel++]];
    }
    var scrollXAdjustedAligned = Math.min(pixelPositionEnd - pixelPosition, 256 - scrollXAdjusted) >> 3;
    scrollXAdjusted += scrollXAdjustedAligned << 3;
    scrollXAdjustedAligned += tileNumber;
    while (tileNumber < scrollXAdjustedAligned) {
        chrCode = this.BGCHRBank1[++tileNumber];
        if (chrCode < this.gfxBackgroundBankOffset) {
            chrCode |= 256;
        }
        attrCode = this.BGCHRBank2[tileNumber];
        tile = this.tileCache[(attrCode & 8) << 8 | (attrCode & 96) << 4 | chrCode];
        palette = (attrCode & 7) << 2;
        texel = tileYLine;
        this.frameBuffer[pixelPosition++] = this.gbcBGPalette[palette | tile[texel++]];
        this.frameBuffer[pixelPosition++] = this.gbcBGPalette[palette | tile[texel++]];
        this.frameBuffer[pixelPosition++] = this.gbcBGPalette[palette | tile[texel++]];
        this.frameBuffer[pixelPosition++] = this.gbcBGPalette[palette | tile[texel++]];
        this.frameBuffer[pixelPosition++] = this.gbcBGPalette[palette | tile[texel++]];
        this.frameBuffer[pixelPosition++] = this.gbcBGPalette[palette | tile[texel++]];
        this.frameBuffer[pixelPosition++] = this.gbcBGPalette[palette | tile[texel++]];
        this.frameBuffer[pixelPosition++] = this.gbcBGPalette[palette | tile[texel]];
    }
    if (pixelPosition < pixelPositionEnd) {
        if (scrollXAdjusted < 256) {
            chrCode = this.BGCHRBank1[++tileNumber];
            if (chrCode < this.gfxBackgroundBankOffset) {
                chrCode |= 256;
            }
            attrCode = this.BGCHRBank2[tileNumber];
            tile = this.tileCache[(attrCode & 8) << 8 | (attrCode & 96) << 4 | chrCode];
            palette = (attrCode & 7) << 2;
            for (texel = tileYLine - 1; pixelPosition < pixelPositionEnd && scrollXAdjusted < 256; ++scrollXAdjusted) {
                this.frameBuffer[pixelPosition++] = this.gbcBGPalette[palette | tile[++texel]];
            }
        }
        scrollXAdjustedAligned = (pixelPositionEnd - pixelPosition >> 3) + tileYDown;
        while (tileYDown < scrollXAdjustedAligned) {
            chrCode = this.BGCHRBank1[tileYDown];
            if (chrCode < this.gfxBackgroundBankOffset) {
                chrCode |= 256;
            }
            attrCode = this.BGCHRBank2[tileYDown++];
            tile = this.tileCache[(attrCode & 8) << 8 | (attrCode & 96) << 4 | chrCode];
            palette = (attrCode & 7) << 2;
            texel = tileYLine;
            this.frameBuffer[pixelPosition++] = this.gbcBGPalette[palette | tile[texel++]];
            this.frameBuffer[pixelPosition++] = this.gbcBGPalette[palette | tile[texel++]];
            this.frameBuffer[pixelPosition++] = this.gbcBGPalette[palette | tile[texel++]];
            this.frameBuffer[pixelPosition++] = this.gbcBGPalette[palette | tile[texel++]];
            this.frameBuffer[pixelPosition++] = this.gbcBGPalette[palette | tile[texel++]];
            this.frameBuffer[pixelPosition++] = this.gbcBGPalette[palette | tile[texel++]];
            this.frameBuffer[pixelPosition++] = this.gbcBGPalette[palette | tile[texel++]];
            this.frameBuffer[pixelPosition++] = this.gbcBGPalette[palette | tile[texel]];
        }
        if (pixelPosition < pixelPositionEnd) {
            chrCode = this.BGCHRBank1[tileYDown];
            if (chrCode < this.gfxBackgroundBankOffset) {
                chrCode |= 256;
            }
            attrCode = this.BGCHRBank2[tileYDown];
            tile = this.tileCache[(attrCode & 8) << 8 | (attrCode & 96) << 4 | chrCode];
            palette = (attrCode & 7) << 2;
            switch (pixelPositionEnd - pixelPosition) {
            case 7:
                this.frameBuffer[pixelPosition + 6] = this.gbcBGPalette[palette | tile[tileYLine | 6]];
            case 6:
                this.frameBuffer[pixelPosition + 5] = this.gbcBGPalette[palette | tile[tileYLine | 5]];
            case 5:
                this.frameBuffer[pixelPosition + 4] = this.gbcBGPalette[palette | tile[tileYLine | 4]];
            case 4:
                this.frameBuffer[pixelPosition + 3] = this.gbcBGPalette[palette | tile[tileYLine | 3]];
            case 3:
                this.frameBuffer[pixelPosition + 2] = this.gbcBGPalette[palette | tile[tileYLine | 2]];
            case 2:
                this.frameBuffer[pixelPosition + 1] = this.gbcBGPalette[palette | tile[tileYLine | 1]];
            case 1:
                this.frameBuffer[pixelPosition] = this.gbcBGPalette[palette | tile[tileYLine]];
            }
        }
    }
});
GameBoyCore.prototype.WindowGBLayerRender = _wrap_(function (scanlineToRender) {
    if (this.gfxWindowDisplay) {
        var scrollYAdjusted = scanlineToRender - this.windowY;
        if (scrollYAdjusted >= 0) {
            var scrollXRangeAdjusted = this.windowX > 0 ? this.windowX + this.currentX : this.currentX;
            var pixelPosition = this.pixelStart + scrollXRangeAdjusted;
            var pixelPositionEnd = this.pixelStart + this.pixelEnd;
            if (pixelPosition < pixelPositionEnd) {
                var tileYLine = (scrollYAdjusted & 7) << 3;
                var tileNumber = (this.gfxWindowCHRBankPosition | (scrollYAdjusted & 248) << 2) + (this.currentX >> 3);
                var chrCode = this.BGCHRBank1[tileNumber];
                if (chrCode < this.gfxBackgroundBankOffset) {
                    chrCode |= 256;
                }
                var tile = this.tileCache[chrCode];
                var texel = scrollXRangeAdjusted - this.windowX & 7;
                scrollXRangeAdjusted = Math.min(8, texel + pixelPositionEnd - pixelPosition);
                while (texel < scrollXRangeAdjusted) {
                    this.frameBuffer[pixelPosition++] = this.BGPalette[tile[tileYLine | texel++]];
                }
                scrollXRangeAdjusted = tileNumber + (pixelPositionEnd - pixelPosition >> 3);
                while (tileNumber < scrollXRangeAdjusted) {
                    chrCode = this.BGCHRBank1[++tileNumber];
                    if (chrCode < this.gfxBackgroundBankOffset) {
                        chrCode |= 256;
                    }
                    tile = this.tileCache[chrCode];
                    texel = tileYLine;
                    this.frameBuffer[pixelPosition++] = this.BGPalette[tile[texel++]];
                    this.frameBuffer[pixelPosition++] = this.BGPalette[tile[texel++]];
                    this.frameBuffer[pixelPosition++] = this.BGPalette[tile[texel++]];
                    this.frameBuffer[pixelPosition++] = this.BGPalette[tile[texel++]];
                    this.frameBuffer[pixelPosition++] = this.BGPalette[tile[texel++]];
                    this.frameBuffer[pixelPosition++] = this.BGPalette[tile[texel++]];
                    this.frameBuffer[pixelPosition++] = this.BGPalette[tile[texel++]];
                    this.frameBuffer[pixelPosition++] = this.BGPalette[tile[texel]];
                }
                if (pixelPosition < pixelPositionEnd) {
                    chrCode = this.BGCHRBank1[++tileNumber];
                    if (chrCode < this.gfxBackgroundBankOffset) {
                        chrCode |= 256;
                    }
                    tile = this.tileCache[chrCode];
                    switch (pixelPositionEnd - pixelPosition) {
                    case 7:
                        this.frameBuffer[pixelPosition + 6] = this.BGPalette[tile[tileYLine | 6]];
                    case 6:
                        this.frameBuffer[pixelPosition + 5] = this.BGPalette[tile[tileYLine | 5]];
                    case 5:
                        this.frameBuffer[pixelPosition + 4] = this.BGPalette[tile[tileYLine | 4]];
                    case 4:
                        this.frameBuffer[pixelPosition + 3] = this.BGPalette[tile[tileYLine | 3]];
                    case 3:
                        this.frameBuffer[pixelPosition + 2] = this.BGPalette[tile[tileYLine | 2]];
                    case 2:
                        this.frameBuffer[pixelPosition + 1] = this.BGPalette[tile[tileYLine | 1]];
                    case 1:
                        this.frameBuffer[pixelPosition] = this.BGPalette[tile[tileYLine]];
                    }
                }
            }
        }
    }
});
GameBoyCore.prototype.WindowGBCLayerRender = _wrap_(function (scanlineToRender) {
    if (this.gfxWindowDisplay) {
        var scrollYAdjusted = scanlineToRender - this.windowY;
        if (scrollYAdjusted >= 0) {
            var scrollXRangeAdjusted = this.windowX > 0 ? this.windowX + this.currentX : this.currentX;
            var pixelPosition = this.pixelStart + scrollXRangeAdjusted;
            var pixelPositionEnd = this.pixelStart + this.pixelEnd;
            if (pixelPosition < pixelPositionEnd) {
                var tileYLine = (scrollYAdjusted & 7) << 3;
                var tileNumber = (this.gfxWindowCHRBankPosition | (scrollYAdjusted & 248) << 2) + (this.currentX >> 3);
                var chrCode = this.BGCHRBank1[tileNumber];
                if (chrCode < this.gfxBackgroundBankOffset) {
                    chrCode |= 256;
                }
                var attrCode = this.BGCHRBank2[tileNumber];
                var tile = this.tileCache[(attrCode & 8) << 8 | (attrCode & 96) << 4 | chrCode];
                var palette = (attrCode & 7) << 2 | (attrCode & 128) >> 2;
                var texel = scrollXRangeAdjusted - this.windowX & 7;
                scrollXRangeAdjusted = Math.min(8, texel + pixelPositionEnd - pixelPosition);
                while (texel < scrollXRangeAdjusted) {
                    this.frameBuffer[pixelPosition++] = this.gbcBGPalette[palette | tile[tileYLine | texel++]];
                }
                scrollXRangeAdjusted = tileNumber + (pixelPositionEnd - pixelPosition >> 3);
                while (tileNumber < scrollXRangeAdjusted) {
                    chrCode = this.BGCHRBank1[++tileNumber];
                    if (chrCode < this.gfxBackgroundBankOffset) {
                        chrCode |= 256;
                    }
                    attrCode = this.BGCHRBank2[tileNumber];
                    tile = this.tileCache[(attrCode & 8) << 8 | (attrCode & 96) << 4 | chrCode];
                    palette = (attrCode & 7) << 2 | (attrCode & 128) >> 2;
                    texel = tileYLine;
                    this.frameBuffer[pixelPosition++] = this.gbcBGPalette[palette | tile[texel++]];
                    this.frameBuffer[pixelPosition++] = this.gbcBGPalette[palette | tile[texel++]];
                    this.frameBuffer[pixelPosition++] = this.gbcBGPalette[palette | tile[texel++]];
                    this.frameBuffer[pixelPosition++] = this.gbcBGPalette[palette | tile[texel++]];
                    this.frameBuffer[pixelPosition++] = this.gbcBGPalette[palette | tile[texel++]];
                    this.frameBuffer[pixelPosition++] = this.gbcBGPalette[palette | tile[texel++]];
                    this.frameBuffer[pixelPosition++] = this.gbcBGPalette[palette | tile[texel++]];
                    this.frameBuffer[pixelPosition++] = this.gbcBGPalette[palette | tile[texel]];
                }
                if (pixelPosition < pixelPositionEnd) {
                    chrCode = this.BGCHRBank1[++tileNumber];
                    if (chrCode < this.gfxBackgroundBankOffset) {
                        chrCode |= 256;
                    }
                    attrCode = this.BGCHRBank2[tileNumber];
                    tile = this.tileCache[(attrCode & 8) << 8 | (attrCode & 96) << 4 | chrCode];
                    palette = (attrCode & 7) << 2 | (attrCode & 128) >> 2;
                    switch (pixelPositionEnd - pixelPosition) {
                    case 7:
                        this.frameBuffer[pixelPosition + 6] = this.gbcBGPalette[palette | tile[tileYLine | 6]];
                    case 6:
                        this.frameBuffer[pixelPosition + 5] = this.gbcBGPalette[palette | tile[tileYLine | 5]];
                    case 5:
                        this.frameBuffer[pixelPosition + 4] = this.gbcBGPalette[palette | tile[tileYLine | 4]];
                    case 4:
                        this.frameBuffer[pixelPosition + 3] = this.gbcBGPalette[palette | tile[tileYLine | 3]];
                    case 3:
                        this.frameBuffer[pixelPosition + 2] = this.gbcBGPalette[palette | tile[tileYLine | 2]];
                    case 2:
                        this.frameBuffer[pixelPosition + 1] = this.gbcBGPalette[palette | tile[tileYLine | 1]];
                    case 1:
                        this.frameBuffer[pixelPosition] = this.gbcBGPalette[palette | tile[tileYLine]];
                    }
                }
            }
        }
    }
});
GameBoyCore.prototype.WindowGBCLayerRenderNoPriorityFlagging = _wrap_(function (scanlineToRender) {
    if (this.gfxWindowDisplay) {
        var scrollYAdjusted = scanlineToRender - this.windowY;
        if (scrollYAdjusted >= 0) {
            var scrollXRangeAdjusted = this.windowX > 0 ? this.windowX + this.currentX : this.currentX;
            var pixelPosition = this.pixelStart + scrollXRangeAdjusted;
            var pixelPositionEnd = this.pixelStart + this.pixelEnd;
            if (pixelPosition < pixelPositionEnd) {
                var tileYLine = (scrollYAdjusted & 7) << 3;
                var tileNumber = (this.gfxWindowCHRBankPosition | (scrollYAdjusted & 248) << 2) + (this.currentX >> 3);
                var chrCode = this.BGCHRBank1[tileNumber];
                if (chrCode < this.gfxBackgroundBankOffset) {
                    chrCode |= 256;
                }
                var attrCode = this.BGCHRBank2[tileNumber];
                var tile = this.tileCache[(attrCode & 8) << 8 | (attrCode & 96) << 4 | chrCode];
                var palette = (attrCode & 7) << 2;
                var texel = scrollXRangeAdjusted - this.windowX & 7;
                scrollXRangeAdjusted = Math.min(8, texel + pixelPositionEnd - pixelPosition);
                while (texel < scrollXRangeAdjusted) {
                    this.frameBuffer[pixelPosition++] = this.gbcBGPalette[palette | tile[tileYLine | texel++]];
                }
                scrollXRangeAdjusted = tileNumber + (pixelPositionEnd - pixelPosition >> 3);
                while (tileNumber < scrollXRangeAdjusted) {
                    chrCode = this.BGCHRBank1[++tileNumber];
                    if (chrCode < this.gfxBackgroundBankOffset) {
                        chrCode |= 256;
                    }
                    attrCode = this.BGCHRBank2[tileNumber];
                    tile = this.tileCache[(attrCode & 8) << 8 | (attrCode & 96) << 4 | chrCode];
                    palette = (attrCode & 7) << 2;
                    texel = tileYLine;
                    this.frameBuffer[pixelPosition++] = this.gbcBGPalette[palette | tile[texel++]];
                    this.frameBuffer[pixelPosition++] = this.gbcBGPalette[palette | tile[texel++]];
                    this.frameBuffer[pixelPosition++] = this.gbcBGPalette[palette | tile[texel++]];
                    this.frameBuffer[pixelPosition++] = this.gbcBGPalette[palette | tile[texel++]];
                    this.frameBuffer[pixelPosition++] = this.gbcBGPalette[palette | tile[texel++]];
                    this.frameBuffer[pixelPosition++] = this.gbcBGPalette[palette | tile[texel++]];
                    this.frameBuffer[pixelPosition++] = this.gbcBGPalette[palette | tile[texel++]];
                    this.frameBuffer[pixelPosition++] = this.gbcBGPalette[palette | tile[texel]];
                }
                if (pixelPosition < pixelPositionEnd) {
                    chrCode = this.BGCHRBank1[++tileNumber];
                    if (chrCode < this.gfxBackgroundBankOffset) {
                        chrCode |= 256;
                    }
                    attrCode = this.BGCHRBank2[tileNumber];
                    tile = this.tileCache[(attrCode & 8) << 8 | (attrCode & 96) << 4 | chrCode];
                    palette = (attrCode & 7) << 2;
                    switch (pixelPositionEnd - pixelPosition) {
                    case 7:
                        this.frameBuffer[pixelPosition + 6] = this.gbcBGPalette[palette | tile[tileYLine | 6]];
                    case 6:
                        this.frameBuffer[pixelPosition + 5] = this.gbcBGPalette[palette | tile[tileYLine | 5]];
                    case 5:
                        this.frameBuffer[pixelPosition + 4] = this.gbcBGPalette[palette | tile[tileYLine | 4]];
                    case 4:
                        this.frameBuffer[pixelPosition + 3] = this.gbcBGPalette[palette | tile[tileYLine | 3]];
                    case 3:
                        this.frameBuffer[pixelPosition + 2] = this.gbcBGPalette[palette | tile[tileYLine | 2]];
                    case 2:
                        this.frameBuffer[pixelPosition + 1] = this.gbcBGPalette[palette | tile[tileYLine | 1]];
                    case 1:
                        this.frameBuffer[pixelPosition] = this.gbcBGPalette[palette | tile[tileYLine]];
                    }
                }
            }
        }
    }
});
GameBoyCore.prototype.SpriteGBLayerRender = _wrap_(function (scanlineToRender) {
    if (this.gfxSpriteShow) {
        var lineAdjusted = scanlineToRender + 16;
        var OAMAddress = 65024;
        var yoffset = 0;
        var xcoord = 1;
        var xCoordStart = 0;
        var xCoordEnd = 0;
        var attrCode = 0;
        var palette = 0;
        var tile = null;
        var data = 0;
        var spriteCount = 0;
        var length = 0;
        var currentPixel = 0;
        var linePixel = 0;
        while (xcoord < 168) {
            this.sortBuffer[xcoord++] = 255;
        }
        if (this.gfxSpriteNormalHeight) {
            for (var length = this.findLowestSpriteDrawable(lineAdjusted, 7); spriteCount < length; ++spriteCount) {
                OAMAddress = this.OAMAddressCache[spriteCount];
                yoffset = lineAdjusted - this.memory[OAMAddress] << 3;
                attrCode = this.memory[OAMAddress | 3];
                palette = (attrCode & 16) >> 2;
                tile = this.tileCache[(attrCode & 96) << 4 | this.memory[OAMAddress | 2]];
                linePixel = xCoordStart = this.memory[OAMAddress | 1];
                xCoordEnd = Math.min(168 - linePixel, 8);
                xcoord = linePixel > 7 ? 0 : 8 - linePixel;
                for (currentPixel = this.pixelStart + (linePixel > 8 ? linePixel - 8 : 0); xcoord < xCoordEnd; ++xcoord, ++currentPixel, ++linePixel) {
                    if (this.sortBuffer[linePixel] > xCoordStart) {
                        if (this.frameBuffer[currentPixel] >= 33554432) {
                            data = tile[yoffset | xcoord];
                            if (data > 0) {
                                this.frameBuffer[currentPixel] = this.OBJPalette[palette | data];
                                this.sortBuffer[linePixel] = xCoordStart;
                            }
                        } else if (this.frameBuffer[currentPixel] < 16777216) {
                            data = tile[yoffset | xcoord];
                            if (data > 0 && attrCode < 128) {
                                this.frameBuffer[currentPixel] = this.OBJPalette[palette | data];
                                this.sortBuffer[linePixel] = xCoordStart;
                            }
                        }
                    }
                }
            }
        } else {
            for (var length = this.findLowestSpriteDrawable(lineAdjusted, 15); spriteCount < length; ++spriteCount) {
                OAMAddress = this.OAMAddressCache[spriteCount];
                yoffset = lineAdjusted - this.memory[OAMAddress] << 3;
                attrCode = this.memory[OAMAddress | 3];
                palette = (attrCode & 16) >> 2;
                if ((attrCode & 64) == (64 & yoffset)) {
                    tile = this.tileCache[(attrCode & 96) << 4 | this.memory[OAMAddress | 2] & 254];
                } else {
                    tile = this.tileCache[(attrCode & 96) << 4 | this.memory[OAMAddress | 2] | 1];
                }
                yoffset &= 63;
                linePixel = xCoordStart = this.memory[OAMAddress | 1];
                xCoordEnd = Math.min(168 - linePixel, 8);
                xcoord = linePixel > 7 ? 0 : 8 - linePixel;
                for (currentPixel = this.pixelStart + (linePixel > 8 ? linePixel - 8 : 0); xcoord < xCoordEnd; ++xcoord, ++currentPixel, ++linePixel) {
                    if (this.sortBuffer[linePixel] > xCoordStart) {
                        if (this.frameBuffer[currentPixel] >= 33554432) {
                            data = tile[yoffset | xcoord];
                            if (data > 0) {
                                this.frameBuffer[currentPixel] = this.OBJPalette[palette | data];
                                this.sortBuffer[linePixel] = xCoordStart;
                            }
                        } else if (this.frameBuffer[currentPixel] < 16777216) {
                            data = tile[yoffset | xcoord];
                            if (data > 0 && attrCode < 128) {
                                this.frameBuffer[currentPixel] = this.OBJPalette[palette | data];
                                this.sortBuffer[linePixel] = xCoordStart;
                            }
                        }
                    }
                }
            }
        }
    }
});
GameBoyCore.prototype.findLowestSpriteDrawable = _wrap_(function (scanlineToRender, drawableRange) {
    var address = 65024;
    var spriteCount = 0;
    var diff = 0;
    while (address < 65184 && spriteCount < 10) {
        diff = scanlineToRender - this.memory[address];
        if ((diff & drawableRange) == diff) {
            this.OAMAddressCache[spriteCount++] = address;
        }
        address += 4;
    }
    return spriteCount;
});
GameBoyCore.prototype.SpriteGBCLayerRender = _wrap_(function (scanlineToRender) {
    if (this.gfxSpriteShow) {
        var OAMAddress = 65024;
        var lineAdjusted = scanlineToRender + 16;
        var yoffset = 0;
        var xcoord = 0;
        var endX = 0;
        var xCounter = 0;
        var attrCode = 0;
        var palette = 0;
        var tile = null;
        var data = 0;
        var currentPixel = 0;
        var spriteCount = 0;
        if (this.gfxSpriteNormalHeight) {
            for (; OAMAddress < 65184 && spriteCount < 10; OAMAddress += 4) {
                yoffset = lineAdjusted - this.memory[OAMAddress];
                if ((yoffset & 7) == yoffset) {
                    xcoord = this.memory[OAMAddress | 1] - 8;
                    endX = Math.min(160, xcoord + 8);
                    attrCode = this.memory[OAMAddress | 3];
                    palette = (attrCode & 7) << 2;
                    tile = this.tileCache[(attrCode & 8) << 8 | (attrCode & 96) << 4 | this.memory[OAMAddress | 2]];
                    xCounter = xcoord > 0 ? xcoord : 0;
                    xcoord -= yoffset << 3;
                    for (currentPixel = this.pixelStart + xCounter; xCounter < endX; ++xCounter, ++currentPixel) {
                        if (this.frameBuffer[currentPixel] >= 33554432) {
                            data = tile[xCounter - xcoord];
                            if (data > 0) {
                                this.frameBuffer[currentPixel] = this.gbcOBJPalette[palette | data];
                            }
                        } else if (this.frameBuffer[currentPixel] < 16777216) {
                            data = tile[xCounter - xcoord];
                            if (data > 0 && attrCode < 128) {
                                this.frameBuffer[currentPixel] = this.gbcOBJPalette[palette | data];
                            }
                        }
                    }
                    ++spriteCount;
                }
            }
        } else {
            for (; OAMAddress < 65184 && spriteCount < 10; OAMAddress += 4) {
                yoffset = lineAdjusted - this.memory[OAMAddress];
                if ((yoffset & 15) == yoffset) {
                    xcoord = this.memory[OAMAddress | 1] - 8;
                    endX = Math.min(160, xcoord + 8);
                    attrCode = this.memory[OAMAddress | 3];
                    palette = (attrCode & 7) << 2;
                    if ((attrCode & 64) == (64 & yoffset << 3)) {
                        tile = this.tileCache[(attrCode & 8) << 8 | (attrCode & 96) << 4 | this.memory[OAMAddress | 2] & 254];
                    } else {
                        tile = this.tileCache[(attrCode & 8) << 8 | (attrCode & 96) << 4 | this.memory[OAMAddress | 2] | 1];
                    }
                    xCounter = xcoord > 0 ? xcoord : 0;
                    xcoord -= (yoffset & 7) << 3;
                    for (currentPixel = this.pixelStart + xCounter; xCounter < endX; ++xCounter, ++currentPixel) {
                        if (this.frameBuffer[currentPixel] >= 33554432) {
                            data = tile[xCounter - xcoord];
                            if (data > 0) {
                                this.frameBuffer[currentPixel] = this.gbcOBJPalette[palette | data];
                            }
                        } else if (this.frameBuffer[currentPixel] < 16777216) {
                            data = tile[xCounter - xcoord];
                            if (data > 0 && attrCode < 128) {
                                this.frameBuffer[currentPixel] = this.gbcOBJPalette[palette | data];
                            }
                        }
                    }
                    ++spriteCount;
                }
            }
        }
    }
});
GameBoyCore.prototype.generateGBTileLine = _wrap_(function (address) {
    var lineCopy = this.memory[1 | address] << 8 | this.memory[40958 & address];
    var tileBlock = this.tileCache[(address & 8176) >> 4];
    address = (address & 14) << 2;
    tileBlock[address | 7] = (lineCopy & 256) >> 7 | lineCopy & 1;
    tileBlock[address | 6] = (lineCopy & 512) >> 8 | (lineCopy & 2) >> 1;
    tileBlock[address | 5] = (lineCopy & 1024) >> 9 | (lineCopy & 4) >> 2;
    tileBlock[address | 4] = (lineCopy & 2048) >> 10 | (lineCopy & 8) >> 3;
    tileBlock[address | 3] = (lineCopy & 4096) >> 11 | (lineCopy & 16) >> 4;
    tileBlock[address | 2] = (lineCopy & 8192) >> 12 | (lineCopy & 32) >> 5;
    tileBlock[address | 1] = (lineCopy & 16384) >> 13 | (lineCopy & 64) >> 6;
    tileBlock[address] = (lineCopy & 32768) >> 14 | (lineCopy & 128) >> 7;
});
GameBoyCore.prototype.generateGBCTileLineBank1 = _wrap_(function (address) {
    var lineCopy = this.memory[1 | address] << 8 | this.memory[40958 & address];
    address &= 8190;
    var tileBlock1 = this.tileCache[address >> 4];
    var tileBlock2 = this.tileCache[512 | address >> 4];
    var tileBlock3 = this.tileCache[1024 | address >> 4];
    var tileBlock4 = this.tileCache[1536 | address >> 4];
    address = (address & 14) << 2;
    var addressFlipped = 56 - address;
    tileBlock4[addressFlipped] = tileBlock2[address] = tileBlock3[addressFlipped | 7] = tileBlock1[address | 7] = (lineCopy & 256) >> 7 | lineCopy & 1;
    tileBlock4[addressFlipped | 1] = tileBlock2[address | 1] = tileBlock3[addressFlipped | 6] = tileBlock1[address | 6] = (lineCopy & 512) >> 8 | (lineCopy & 2) >> 1;
    tileBlock4[addressFlipped | 2] = tileBlock2[address | 2] = tileBlock3[addressFlipped | 5] = tileBlock1[address | 5] = (lineCopy & 1024) >> 9 | (lineCopy & 4) >> 2;
    tileBlock4[addressFlipped | 3] = tileBlock2[address | 3] = tileBlock3[addressFlipped | 4] = tileBlock1[address | 4] = (lineCopy & 2048) >> 10 | (lineCopy & 8) >> 3;
    tileBlock4[addressFlipped | 4] = tileBlock2[address | 4] = tileBlock3[addressFlipped | 3] = tileBlock1[address | 3] = (lineCopy & 4096) >> 11 | (lineCopy & 16) >> 4;
    tileBlock4[addressFlipped | 5] = tileBlock2[address | 5] = tileBlock3[addressFlipped | 2] = tileBlock1[address | 2] = (lineCopy & 8192) >> 12 | (lineCopy & 32) >> 5;
    tileBlock4[addressFlipped | 6] = tileBlock2[address | 6] = tileBlock3[addressFlipped | 1] = tileBlock1[address | 1] = (lineCopy & 16384) >> 13 | (lineCopy & 64) >> 6;
    tileBlock4[addressFlipped | 7] = tileBlock2[address | 7] = tileBlock3[addressFlipped] = tileBlock1[address] = (lineCopy & 32768) >> 14 | (lineCopy & 128) >> 7;
});
GameBoyCore.prototype.generateGBCTileBank1 = _wrap_(function (vramAddress) {
    var address = vramAddress >> 4;
    var tileBlock1 = this.tileCache[address];
    var tileBlock2 = this.tileCache[512 | address];
    var tileBlock3 = this.tileCache[1024 | address];
    var tileBlock4 = this.tileCache[1536 | address];
    var lineCopy = 0;
    vramAddress |= 32768;
    address = 0;
    var addressFlipped = 56;
    do {
        lineCopy = this.memory[1 | vramAddress] << 8 | this.memory[vramAddress];
        tileBlock4[addressFlipped] = tileBlock2[address] = tileBlock3[addressFlipped | 7] = tileBlock1[address | 7] = (lineCopy & 256) >> 7 | lineCopy & 1;
        tileBlock4[addressFlipped | 1] = tileBlock2[address | 1] = tileBlock3[addressFlipped | 6] = tileBlock1[address | 6] = (lineCopy & 512) >> 8 | (lineCopy & 2) >> 1;
        tileBlock4[addressFlipped | 2] = tileBlock2[address | 2] = tileBlock3[addressFlipped | 5] = tileBlock1[address | 5] = (lineCopy & 1024) >> 9 | (lineCopy & 4) >> 2;
        tileBlock4[addressFlipped | 3] = tileBlock2[address | 3] = tileBlock3[addressFlipped | 4] = tileBlock1[address | 4] = (lineCopy & 2048) >> 10 | (lineCopy & 8) >> 3;
        tileBlock4[addressFlipped | 4] = tileBlock2[address | 4] = tileBlock3[addressFlipped | 3] = tileBlock1[address | 3] = (lineCopy & 4096) >> 11 | (lineCopy & 16) >> 4;
        tileBlock4[addressFlipped | 5] = tileBlock2[address | 5] = tileBlock3[addressFlipped | 2] = tileBlock1[address | 2] = (lineCopy & 8192) >> 12 | (lineCopy & 32) >> 5;
        tileBlock4[addressFlipped | 6] = tileBlock2[address | 6] = tileBlock3[addressFlipped | 1] = tileBlock1[address | 1] = (lineCopy & 16384) >> 13 | (lineCopy & 64) >> 6;
        tileBlock4[addressFlipped | 7] = tileBlock2[address | 7] = tileBlock3[addressFlipped] = tileBlock1[address] = (lineCopy & 32768) >> 14 | (lineCopy & 128) >> 7;
        address += 8;
        addressFlipped -= 8;
        vramAddress += 2;
    } while (addressFlipped > -1);
});
GameBoyCore.prototype.generateGBCTileLineBank2 = _wrap_(function (address) {
    var lineCopy = this.VRAM[1 | address] << 8 | this.VRAM[8190 & address];
    var tileBlock1 = this.tileCache[2048 | address >> 4];
    var tileBlock2 = this.tileCache[2560 | address >> 4];
    var tileBlock3 = this.tileCache[3072 | address >> 4];
    var tileBlock4 = this.tileCache[3584 | address >> 4];
    address = (address & 14) << 2;
    var addressFlipped = 56 - address;
    tileBlock4[addressFlipped] = tileBlock2[address] = tileBlock3[addressFlipped | 7] = tileBlock1[address | 7] = (lineCopy & 256) >> 7 | lineCopy & 1;
    tileBlock4[addressFlipped | 1] = tileBlock2[address | 1] = tileBlock3[addressFlipped | 6] = tileBlock1[address | 6] = (lineCopy & 512) >> 8 | (lineCopy & 2) >> 1;
    tileBlock4[addressFlipped | 2] = tileBlock2[address | 2] = tileBlock3[addressFlipped | 5] = tileBlock1[address | 5] = (lineCopy & 1024) >> 9 | (lineCopy & 4) >> 2;
    tileBlock4[addressFlipped | 3] = tileBlock2[address | 3] = tileBlock3[addressFlipped | 4] = tileBlock1[address | 4] = (lineCopy & 2048) >> 10 | (lineCopy & 8) >> 3;
    tileBlock4[addressFlipped | 4] = tileBlock2[address | 4] = tileBlock3[addressFlipped | 3] = tileBlock1[address | 3] = (lineCopy & 4096) >> 11 | (lineCopy & 16) >> 4;
    tileBlock4[addressFlipped | 5] = tileBlock2[address | 5] = tileBlock3[addressFlipped | 2] = tileBlock1[address | 2] = (lineCopy & 8192) >> 12 | (lineCopy & 32) >> 5;
    tileBlock4[addressFlipped | 6] = tileBlock2[address | 6] = tileBlock3[addressFlipped | 1] = tileBlock1[address | 1] = (lineCopy & 16384) >> 13 | (lineCopy & 64) >> 6;
    tileBlock4[addressFlipped | 7] = tileBlock2[address | 7] = tileBlock3[addressFlipped] = tileBlock1[address] = (lineCopy & 32768) >> 14 | (lineCopy & 128) >> 7;
});
GameBoyCore.prototype.generateGBCTileBank2 = _wrap_(function (vramAddress) {
    var address = vramAddress >> 4;
    var tileBlock1 = this.tileCache[2048 | address];
    var tileBlock2 = this.tileCache[2560 | address];
    var tileBlock3 = this.tileCache[3072 | address];
    var tileBlock4 = this.tileCache[3584 | address];
    var lineCopy = 0;
    address = 0;
    var addressFlipped = 56;
    do {
        lineCopy = this.VRAM[1 | vramAddress] << 8 | this.VRAM[vramAddress];
        tileBlock4[addressFlipped] = tileBlock2[address] = tileBlock3[addressFlipped | 7] = tileBlock1[address | 7] = (lineCopy & 256) >> 7 | lineCopy & 1;
        tileBlock4[addressFlipped | 1] = tileBlock2[address | 1] = tileBlock3[addressFlipped | 6] = tileBlock1[address | 6] = (lineCopy & 512) >> 8 | (lineCopy & 2) >> 1;
        tileBlock4[addressFlipped | 2] = tileBlock2[address | 2] = tileBlock3[addressFlipped | 5] = tileBlock1[address | 5] = (lineCopy & 1024) >> 9 | (lineCopy & 4) >> 2;
        tileBlock4[addressFlipped | 3] = tileBlock2[address | 3] = tileBlock3[addressFlipped | 4] = tileBlock1[address | 4] = (lineCopy & 2048) >> 10 | (lineCopy & 8) >> 3;
        tileBlock4[addressFlipped | 4] = tileBlock2[address | 4] = tileBlock3[addressFlipped | 3] = tileBlock1[address | 3] = (lineCopy & 4096) >> 11 | (lineCopy & 16) >> 4;
        tileBlock4[addressFlipped | 5] = tileBlock2[address | 5] = tileBlock3[addressFlipped | 2] = tileBlock1[address | 2] = (lineCopy & 8192) >> 12 | (lineCopy & 32) >> 5;
        tileBlock4[addressFlipped | 6] = tileBlock2[address | 6] = tileBlock3[addressFlipped | 1] = tileBlock1[address | 1] = (lineCopy & 16384) >> 13 | (lineCopy & 64) >> 6;
        tileBlock4[addressFlipped | 7] = tileBlock2[address | 7] = tileBlock3[addressFlipped] = tileBlock1[address] = (lineCopy & 32768) >> 14 | (lineCopy & 128) >> 7;
        address += 8;
        addressFlipped -= 8;
        vramAddress += 2;
    } while (addressFlipped > -1);
});
GameBoyCore.prototype.generateGBOAMTileLine = _wrap_(function (address) {
    var lineCopy = this.memory[1 | address] << 8 | this.memory[40958 & address];
    address &= 8190;
    var tileBlock1 = this.tileCache[address >> 4];
    var tileBlock2 = this.tileCache[512 | address >> 4];
    var tileBlock3 = this.tileCache[1024 | address >> 4];
    var tileBlock4 = this.tileCache[1536 | address >> 4];
    address = (address & 14) << 2;
    var addressFlipped = 56 - address;
    tileBlock4[addressFlipped] = tileBlock2[address] = tileBlock3[addressFlipped | 7] = tileBlock1[address | 7] = (lineCopy & 256) >> 7 | lineCopy & 1;
    tileBlock4[addressFlipped | 1] = tileBlock2[address | 1] = tileBlock3[addressFlipped | 6] = tileBlock1[address | 6] = (lineCopy & 512) >> 8 | (lineCopy & 2) >> 1;
    tileBlock4[addressFlipped | 2] = tileBlock2[address | 2] = tileBlock3[addressFlipped | 5] = tileBlock1[address | 5] = (lineCopy & 1024) >> 9 | (lineCopy & 4) >> 2;
    tileBlock4[addressFlipped | 3] = tileBlock2[address | 3] = tileBlock3[addressFlipped | 4] = tileBlock1[address | 4] = (lineCopy & 2048) >> 10 | (lineCopy & 8) >> 3;
    tileBlock4[addressFlipped | 4] = tileBlock2[address | 4] = tileBlock3[addressFlipped | 3] = tileBlock1[address | 3] = (lineCopy & 4096) >> 11 | (lineCopy & 16) >> 4;
    tileBlock4[addressFlipped | 5] = tileBlock2[address | 5] = tileBlock3[addressFlipped | 2] = tileBlock1[address | 2] = (lineCopy & 8192) >> 12 | (lineCopy & 32) >> 5;
    tileBlock4[addressFlipped | 6] = tileBlock2[address | 6] = tileBlock3[addressFlipped | 1] = tileBlock1[address | 1] = (lineCopy & 16384) >> 13 | (lineCopy & 64) >> 6;
    tileBlock4[addressFlipped | 7] = tileBlock2[address | 7] = tileBlock3[addressFlipped] = tileBlock1[address] = (lineCopy & 32768) >> 14 | (lineCopy & 128) >> 7;
});
GameBoyCore.prototype.graphicsJIT = _wrap_(function () {
    if (this.LCDisOn) {
        this.totalLinesPassed = 0;
        this.graphicsJITScanlineGroup();
    }
});
GameBoyCore.prototype.graphicsJITVBlank = _wrap_(function () {
    this.totalLinesPassed += this.queuedScanLines;
    this.graphicsJITScanlineGroup();
});
GameBoyCore.prototype.graphicsJITScanlineGroup = _wrap_(function () {
    while (this.queuedScanLines > 0) {
        this.renderScanLine(this.lastUnrenderedLine);
        if (this.lastUnrenderedLine < 143) {
            ++this.lastUnrenderedLine;
        } else {
            this.lastUnrenderedLine = 0;
        }
        --this.queuedScanLines;
    }
});
GameBoyCore.prototype.incrementScanLineQueue = _wrap_(function () {
    if (this.queuedScanLines < 144) {
        ++this.queuedScanLines;
    } else {
        this.currentX = 0;
        this.midScanlineOffset = -1;
        if (this.lastUnrenderedLine < 143) {
            ++this.lastUnrenderedLine;
        } else {
            this.lastUnrenderedLine = 0;
        }
    }
});
GameBoyCore.prototype.midScanLineJIT = _wrap_(function () {
    this.graphicsJIT();
    this.renderMidScanLine();
});
GameBoyCore.prototype.launchIRQ = _wrap_(function () {
    var bitShift = 0;
    var testbit = 1;
    do {
        if ((testbit & this.IRQLineMatched) == testbit) {
            this.IME = false;
            this.interruptsRequested -= testbit;
            this.IRQLineMatched = 0;
            this.CPUTicks = 20;
            this.stackPointer = this.stackPointer - 1 & 65535;
            this.memoryWriter[this.stackPointer](this, this.stackPointer, this.programCounter >> 8);
            this.stackPointer = this.stackPointer - 1 & 65535;
            this.memoryWriter[this.stackPointer](this, this.stackPointer, this.programCounter & 255);
            this.programCounter = 64 | bitShift << 3;
            this.updateCore();
            return;
        }
        testbit = 1 << ++bitShift;
    } while (bitShift < 5);
});
GameBoyCore.prototype.checkIRQMatching = _wrap_(function () {
    if (this.IME) {
        this.IRQLineMatched = this.interruptsEnabled & this.interruptsRequested & 31;
    }
});
GameBoyCore.prototype.calculateHALTPeriod = _wrap_(function () {
    if (!this.halt) {
        this.halt = true;
        var currentClocks = -1;
        var temp_var = 0;
        if (this.LCDisOn) {
            if ((this.interruptsEnabled & 1) == 1) {
                currentClocks = 456 * ((this.modeSTAT == 1 ? 298 : 144) - this.actualScanLine) - this.LCDTicks << this.doubleSpeedShifter;
            }
            if ((this.interruptsEnabled & 2) == 2) {
                if (this.mode0TriggerSTAT) {
                    temp_var = this.clocksUntilMode0() - this.LCDTicks << this.doubleSpeedShifter;
                    if (temp_var <= currentClocks || currentClocks == -1) {
                        currentClocks = temp_var;
                    }
                }
                if (this.mode1TriggerSTAT && (this.interruptsEnabled & 1) == 0) {
                    temp_var = 456 * ((this.modeSTAT == 1 ? 298 : 144) - this.actualScanLine) - this.LCDTicks << this.doubleSpeedShifter;
                    if (temp_var <= currentClocks || currentClocks == -1) {
                        currentClocks = temp_var;
                    }
                }
                if (this.mode2TriggerSTAT) {
                    temp_var = (this.actualScanLine >= 143 ? 456 * (154 - this.actualScanLine) : 456) - this.LCDTicks << this.doubleSpeedShifter;
                    if (temp_var <= currentClocks || currentClocks == -1) {
                        currentClocks = temp_var;
                    }
                }
                if (this.LYCMatchTriggerSTAT && this.memory[65349] <= 153) {
                    temp_var = this.clocksUntilLYCMatch() - this.LCDTicks << this.doubleSpeedShifter;
                    if (temp_var <= currentClocks || currentClocks == -1) {
                        currentClocks = temp_var;
                    }
                }
            }
        }
        if (this.TIMAEnabled && (this.interruptsEnabled & 4) == 4) {
            temp_var = (256 - this.memory[65285]) * this.TACClocker - this.timerTicks;
            if (temp_var <= currentClocks || currentClocks == -1) {
                currentClocks = temp_var;
            }
        }
        if (this.serialTimer > 0 && (this.interruptsEnabled & 8) == 8) {
            if (this.serialTimer <= currentClocks || currentClocks == -1) {
                currentClocks = this.serialTimer;
            }
        }
    } else {
        var currentClocks = this.remainingClocks;
    }
    var maxClocks = this.CPUCyclesTotal - this.emulatorTicks << this.doubleSpeedShifter;
    if (currentClocks >= 0) {
        if (currentClocks <= maxClocks) {
            this.CPUTicks = Math.max(currentClocks, this.CPUTicks);
            this.updateCoreFull();
            this.halt = false;
            this.CPUTicks = 0;
        } else {
            this.CPUTicks = Math.max(maxClocks, this.CPUTicks);
            this.remainingClocks = currentClocks - this.CPUTicks;
        }
    } else {
        this.CPUTicks += maxClocks;
    }
});
GameBoyCore.prototype.memoryRead = _wrap_(function (address) {
    return this.memoryReader[address](this, address);
});
GameBoyCore.prototype.memoryHighRead = _wrap_(function (address) {
    return this.memoryHighReader[address](this, address);
});
GameBoyCore.prototype.memoryReadJumpCompile = _wrap_(function () {
    for (var index = 0; index <= 65535; index++) {
        if (index < 16384) {
            this.memoryReader[index] = this.memoryReadNormal;
        } else if (index < 32768) {
            this.memoryReader[index] = this.memoryReadROM;
        } else if (index < 38912) {
            this.memoryReader[index] = this.cGBC ? this.VRAMDATAReadCGBCPU : this.VRAMDATAReadDMGCPU;
        } else if (index < 40960) {
            this.memoryReader[index] = this.cGBC ? this.VRAMCHRReadCGBCPU : this.VRAMCHRReadDMGCPU;
        } else if (index >= 40960 && index < 49152) {
            if (this.numRAMBanks == 1 / 16 && index < 41472 || this.numRAMBanks >= 1) {
                if (this.cMBC7) {
                    this.memoryReader[index] = this.memoryReadMBC7;
                } else if (!this.cMBC3) {
                    this.memoryReader[index] = this.memoryReadMBC;
                } else {
                    this.memoryReader[index] = this.memoryReadMBC3;
                }
            } else {
                this.memoryReader[index] = this.memoryReadBAD;
            }
        } else if (index >= 49152 && index < 57344) {
            if (!this.cGBC || index < 53248) {
                this.memoryReader[index] = this.memoryReadNormal;
            } else {
                this.memoryReader[index] = this.memoryReadGBCMemory;
            }
        } else if (index >= 57344 && index < 65024) {
            if (!this.cGBC || index < 61440) {
                this.memoryReader[index] = this.memoryReadECHONormal;
            } else {
                this.memoryReader[index] = this.memoryReadECHOGBCMemory;
            }
        } else if (index < 65184) {
            this.memoryReader[index] = this.memoryReadOAM;
        } else if (this.cGBC && index >= 65184 && index < 65280) {
            this.memoryReader[index] = this.memoryReadNormal;
        } else if (index >= 65280) {
            switch (index) {
            case 65280:
                this.memoryHighReader[0] = this.memoryReader[65280] = _wrap_(function (parentObj, address) {
                    return 192 | parentObj.memory[65280];
                });
                break;
            case 65281:
                this.memoryHighReader[1] = this.memoryReader[65281] = _wrap_(function (parentObj, address) {
                    return parentObj.memory[65282] < 128 ? parentObj.memory[65281] : 255;
                });
                break;
            case 65282:
                if (this.cGBC) {
                    this.memoryHighReader[2] = this.memoryReader[65282] = _wrap_(function (parentObj, address) {
                        return (parentObj.serialTimer <= 0 ? 124 : 252) | parentObj.memory[65282];
                    });
                } else {
                    this.memoryHighReader[2] = this.memoryReader[65282] = _wrap_(function (parentObj, address) {
                        return (parentObj.serialTimer <= 0 ? 126 : 254) | parentObj.memory[65282];
                    });
                }
                break;
            case 65284:
                this.memoryHighReader[4] = this.memoryReader[65284] = _wrap_(function (parentObj, address) {
                    parentObj.memory[65284] = parentObj.memory[65284] + (parentObj.DIVTicks >> 8) & 255;
                    parentObj.DIVTicks &= 255;
                    return parentObj.memory[65284];
                });
                break;
            case 65287:
                this.memoryHighReader[7] = this.memoryReader[65287] = _wrap_(function (parentObj, address) {
                    return 248 | parentObj.memory[65287];
                });
                break;
            case 65295:
                this.memoryHighReader[15] = this.memoryReader[65295] = _wrap_(function (parentObj, address) {
                    return 224 | parentObj.interruptsRequested;
                });
                break;
            case 65296:
                this.memoryHighReader[16] = this.memoryReader[65296] = _wrap_(function (parentObj, address) {
                    return 128 | parentObj.memory[65296];
                });
                break;
            case 65297:
                this.memoryHighReader[17] = this.memoryReader[65297] = _wrap_(function (parentObj, address) {
                    return 63 | parentObj.memory[65297];
                });
                break;
            case 65299:
                this.memoryHighReader[19] = this.memoryReader[65299] = this.memoryReadBAD;
                break;
            case 65300:
                this.memoryHighReader[20] = this.memoryReader[65300] = _wrap_(function (parentObj, address) {
                    return 191 | parentObj.memory[65300];
                });
                break;
            case 65302:
                this.memoryHighReader[22] = this.memoryReader[65302] = _wrap_(function (parentObj, address) {
                    return 63 | parentObj.memory[65302];
                });
                break;
            case 65304:
                this.memoryHighReader[24] = this.memoryReader[65304] = this.memoryReadBAD;
                break;
            case 65305:
                this.memoryHighReader[25] = this.memoryReader[65305] = _wrap_(function (parentObj, address) {
                    return 191 | parentObj.memory[65305];
                });
                break;
            case 65306:
                this.memoryHighReader[26] = this.memoryReader[65306] = _wrap_(function (parentObj, address) {
                    return 127 | parentObj.memory[65306];
                });
                break;
            case 65307:
                this.memoryHighReader[27] = this.memoryReader[65307] = this.memoryReadBAD;
                break;
            case 65308:
                this.memoryHighReader[28] = this.memoryReader[65308] = _wrap_(function (parentObj, address) {
                    return 159 | parentObj.memory[65308];
                });
                break;
            case 65309:
                this.memoryHighReader[29] = this.memoryReader[65309] = _wrap_(function (parentObj, address) {
                    return 255;
                });
                break;
            case 65310:
                this.memoryHighReader[30] = this.memoryReader[65310] = _wrap_(function (parentObj, address) {
                    return 191 | parentObj.memory[65310];
                });
                break;
            case 65311:
            case 65312:
                this.memoryHighReader[index & 255] = this.memoryReader[index] = this.memoryReadBAD;
                break;
            case 65315:
                this.memoryHighReader[35] = this.memoryReader[65315] = _wrap_(function (parentObj, address) {
                    return 191 | parentObj.memory[65315];
                });
                break;
            case 65318:
                this.memoryHighReader[38] = this.memoryReader[65318] = _wrap_(function (parentObj, address) {
                    parentObj.audioJIT();
                    return 112 | parentObj.memory[65318];
                });
                break;
            case 65319:
            case 65320:
            case 65321:
            case 65322:
            case 65323:
            case 65324:
            case 65325:
            case 65326:
            case 65327:
                this.memoryHighReader[index & 255] = this.memoryReader[index] = this.memoryReadBAD;
                break;
            case 65328:
            case 65329:
            case 65330:
            case 65331:
            case 65332:
            case 65333:
            case 65334:
            case 65335:
            case 65336:
            case 65337:
            case 65338:
            case 65339:
            case 65340:
            case 65341:
            case 65342:
            case 65343:
                this.memoryReader[index] = _wrap_(function (parentObj, address) {
                    return parentObj.channel3canPlay ? parentObj.memory[65280 | parentObj.channel3lastSampleLookup >> 1] : parentObj.memory[address];
                });
                this.memoryHighReader[index & 255] = _wrap_(function (parentObj, address) {
                    return parentObj.channel3canPlay ? parentObj.memory[65280 | parentObj.channel3lastSampleLookup >> 1] : parentObj.memory[65280 | address];
                });
                break;
            case 65345:
                this.memoryHighReader[65] = this.memoryReader[65345] = _wrap_(function (parentObj, address) {
                    return 128 | parentObj.memory[65345] | parentObj.modeSTAT;
                });
                break;
            case 65346:
                this.memoryHighReader[66] = this.memoryReader[65346] = _wrap_(function (parentObj, address) {
                    return parentObj.backgroundY;
                });
                break;
            case 65347:
                this.memoryHighReader[67] = this.memoryReader[65347] = _wrap_(function (parentObj, address) {
                    return parentObj.backgroundX;
                });
                break;
            case 65348:
                this.memoryHighReader[68] = this.memoryReader[65348] = _wrap_(function (parentObj, address) {
                    return parentObj.LCDisOn ? parentObj.memory[65348] : 0;
                });
                break;
            case 65354:
                this.memoryHighReader[74] = this.memoryReader[65354] = _wrap_(function (parentObj, address) {
                    return parentObj.windowY;
                });
                break;
            case 65359:
                this.memoryHighReader[79] = this.memoryReader[65359] = _wrap_(function (parentObj, address) {
                    return parentObj.currVRAMBank;
                });
                break;
            case 65365:
                if (this.cGBC) {
                    this.memoryHighReader[85] = this.memoryReader[65365] = _wrap_(function (parentObj, address) {
                        if (!parentObj.LCDisOn && parentObj.hdmaRunning) {
                            parentObj.DMAWrite((parentObj.memory[65365] & 127) + 1);
                            parentObj.memory[65365] = 255;
                            parentObj.hdmaRunning = false;
                        }
                        return parentObj.memory[65365];
                    });
                } else {
                    this.memoryReader[65365] = this.memoryReadNormal;
                    this.memoryHighReader[85] = this.memoryHighReadNormal;
                }
                break;
            case 65366:
                if (this.cGBC) {
                    this.memoryHighReader[86] = this.memoryReader[65366] = _wrap_(function (parentObj, address) {
                        return 60 | (parentObj.memory[65366] >= 192 ? 2 | parentObj.memory[65366] & 193 : parentObj.memory[65366] & 195);
                    });
                } else {
                    this.memoryReader[65366] = this.memoryReadNormal;
                    this.memoryHighReader[86] = this.memoryHighReadNormal;
                }
                break;
            case 65388:
                if (this.cGBC) {
                    this.memoryHighReader[108] = this.memoryReader[65388] = _wrap_(function (parentObj, address) {
                        return 254 | parentObj.memory[65388];
                    });
                } else {
                    this.memoryHighReader[108] = this.memoryReader[65388] = this.memoryReadBAD;
                }
                break;
            case 65392:
                if (this.cGBC) {
                    this.memoryHighReader[112] = this.memoryReader[65392] = _wrap_(function (parentObj, address) {
                        return 64 | parentObj.memory[65392];
                    });
                } else {
                    this.memoryHighReader[112] = this.memoryReader[65392] = this.memoryReadBAD;
                }
                break;
            case 65397:
                this.memoryHighReader[117] = this.memoryReader[65397] = _wrap_(function (parentObj, address) {
                    return 143 | parentObj.memory[65397];
                });
                break;
            case 65398:
            case 65399:
                this.memoryHighReader[index & 255] = this.memoryReader[index] = _wrap_(function (parentObj, address) {
                    return 0;
                });
                break;
            case 65535:
                this.memoryHighReader[255] = this.memoryReader[65535] = _wrap_(function (parentObj, address) {
                    return parentObj.interruptsEnabled;
                });
                break;
            default:
                this.memoryReader[index] = this.memoryReadNormal;
                this.memoryHighReader[index & 255] = this.memoryHighReadNormal;
            }
        } else {
            this.memoryReader[index] = this.memoryReadBAD;
        }
    }
});
GameBoyCore.prototype.memoryReadNormal = _wrap_(function (parentObj, address) {
    return parentObj.memory[address];
});
GameBoyCore.prototype.memoryHighReadNormal = _wrap_(function (parentObj, address) {
    return parentObj.memory[65280 | address];
});
GameBoyCore.prototype.memoryReadROM = _wrap_(function (parentObj, address) {
    return parentObj.ROM[parentObj.currentROMBank + address];
});
GameBoyCore.prototype.memoryReadMBC = _wrap_(function (parentObj, address) {
    if (parentObj.MBCRAMBanksEnabled || settings[10]) {
        return parentObj.MBCRam[address + parentObj.currMBCRAMBankPosition];
    }
    return 255;
});
GameBoyCore.prototype.memoryReadMBC7 = _wrap_(function (parentObj, address) {
    if (parentObj.MBCRAMBanksEnabled || settings[10]) {
        switch (address) {
        case 40960:
        case 41056:
        case 41072:
            return 0;
        case 41088:
            return 0;
        case 41040:
            return parentObj.highY;
        case 41024:
            return parentObj.lowY;
        case 41008:
            return parentObj.highX;
        case 40992:
            return parentObj.lowX;
        default:
            return parentObj.MBCRam[address + parentObj.currMBCRAMBankPosition];
        }
    }
    return 255;
});
GameBoyCore.prototype.memoryReadMBC3 = _wrap_(function (parentObj, address) {
    if (parentObj.MBCRAMBanksEnabled || settings[10]) {
        switch (parentObj.currMBCRAMBank) {
        case 0:
        case 1:
        case 2:
        case 3:
            return parentObj.MBCRam[address + parentObj.currMBCRAMBankPosition];
            break;
        case 8:
            return parentObj.latchedSeconds;
            break;
        case 9:
            return parentObj.latchedMinutes;
            break;
        case 10:
            return parentObj.latchedHours;
            break;
        case 11:
            return parentObj.latchedLDays;
            break;
        case 12:
            return (parentObj.RTCDayOverFlow ? 128 : 0) + (parentObj.RTCHALT ? 64 : 0) + parentObj.latchedHDays;
        }
    }
    return 255;
});
GameBoyCore.prototype.memoryReadGBCMemory = _wrap_(function (parentObj, address) {
    return parentObj.GBCMemory[address + parentObj.gbcRamBankPosition];
});
GameBoyCore.prototype.memoryReadOAM = _wrap_(function (parentObj, address) {
    return parentObj.modeSTAT > 1 ? 255 : parentObj.memory[address];
});
GameBoyCore.prototype.memoryReadECHOGBCMemory = _wrap_(function (parentObj, address) {
    return parentObj.GBCMemory[address + parentObj.gbcRamBankPositionECHO];
});
GameBoyCore.prototype.memoryReadECHONormal = _wrap_(function (parentObj, address) {
    return parentObj.memory[address - 8192];
});
GameBoyCore.prototype.memoryReadBAD = _wrap_(function (parentObj, address) {
    return 255;
});
GameBoyCore.prototype.VRAMDATAReadCGBCPU = _wrap_(function (parentObj, address) {
    return parentObj.modeSTAT > 2 ? 255 : parentObj.currVRAMBank == 0 ? parentObj.memory[address] : parentObj.VRAM[address & 8191];
});
GameBoyCore.prototype.VRAMDATAReadDMGCPU = _wrap_(function (parentObj, address) {
    return parentObj.modeSTAT > 2 ? 255 : parentObj.memory[address];
});
GameBoyCore.prototype.VRAMCHRReadCGBCPU = _wrap_(function (parentObj, address) {
    return parentObj.modeSTAT > 2 ? 255 : parentObj.BGCHRCurrentBank[address & 2047];
});
GameBoyCore.prototype.VRAMCHRReadDMGCPU = _wrap_(function (parentObj, address) {
    return parentObj.modeSTAT > 2 ? 255 : parentObj.BGCHRBank1[address & 2047];
});
GameBoyCore.prototype.setCurrentMBC1ROMBank = _wrap_(function () {
    switch (this.ROMBank1offs) {
    case 0:
    case 32:
    case 64:
    case 96:
        this.currentROMBank = this.ROMBank1offs % this.ROMBankEdge << 14;
        break;
    default:
        this.currentROMBank = this.ROMBank1offs % this.ROMBankEdge - 1 << 14;
    }
});
GameBoyCore.prototype.setCurrentMBC2AND3ROMBank = _wrap_(function () {
    this.currentROMBank = Math.max(this.ROMBank1offs % this.ROMBankEdge - 1, 0) << 14;
});
GameBoyCore.prototype.setCurrentMBC5ROMBank = _wrap_(function () {
    this.currentROMBank = this.ROMBank1offs % this.ROMBankEdge - 1 << 14;
});
GameBoyCore.prototype.memoryWrite = _wrap_(function (address, data) {
    this.memoryWriter[address](this, address, data);
});
GameBoyCore.prototype.memoryHighWrite = _wrap_(function (address, data) {
    this.memoryHighWriter[address](this, address, data);
});
GameBoyCore.prototype.memoryWriteJumpCompile = _wrap_(function () {
    for (var index = 0; index <= 65535; index++) {
        if (index < 32768) {
            if (this.cMBC1) {
                if (index < 8192) {
                    this.memoryWriter[index] = this.MBCWriteEnable;
                } else if (index < 16384) {
                    this.memoryWriter[index] = this.MBC1WriteROMBank;
                } else if (index < 24576) {
                    this.memoryWriter[index] = this.MBC1WriteRAMBank;
                } else {
                    this.memoryWriter[index] = this.MBC1WriteType;
                }
            } else if (this.cMBC2) {
                if (index < 4096) {
                    this.memoryWriter[index] = this.MBCWriteEnable;
                } else if (index >= 8448 && index < 8704) {
                    this.memoryWriter[index] = this.MBC2WriteROMBank;
                } else {
                    this.memoryWriter[index] = this.cartIgnoreWrite;
                }
            } else if (this.cMBC3) {
                if (index < 8192) {
                    this.memoryWriter[index] = this.MBCWriteEnable;
                } else if (index < 16384) {
                    this.memoryWriter[index] = this.MBC3WriteROMBank;
                } else if (index < 24576) {
                    this.memoryWriter[index] = this.MBC3WriteRAMBank;
                } else {
                    this.memoryWriter[index] = this.MBC3WriteRTCLatch;
                }
            } else if (this.cMBC5 || this.cRUMBLE || this.cMBC7) {
                if (index < 8192) {
                    this.memoryWriter[index] = this.MBCWriteEnable;
                } else if (index < 12288) {
                    this.memoryWriter[index] = this.MBC5WriteROMBankLow;
                } else if (index < 16384) {
                    this.memoryWriter[index] = this.MBC5WriteROMBankHigh;
                } else if (index < 24576) {
                    this.memoryWriter[index] = this.cRUMBLE ? this.RUMBLEWriteRAMBank : this.MBC5WriteRAMBank;
                } else {
                    this.memoryWriter[index] = this.cartIgnoreWrite;
                }
            } else if (this.cHuC3) {
                if (index < 8192) {
                    this.memoryWriter[index] = this.MBCWriteEnable;
                } else if (index < 16384) {
                    this.memoryWriter[index] = this.MBC3WriteROMBank;
                } else if (index < 24576) {
                    this.memoryWriter[index] = this.HuC3WriteRAMBank;
                } else {
                    this.memoryWriter[index] = this.cartIgnoreWrite;
                }
            } else {
                this.memoryWriter[index] = this.cartIgnoreWrite;
            }
        } else if (index < 36864) {
            this.memoryWriter[index] = this.cGBC ? this.VRAMGBCDATAWrite : this.VRAMGBDATAWrite;
        } else if (index < 38912) {
            this.memoryWriter[index] = this.cGBC ? this.VRAMGBCDATAWrite : this.VRAMGBDATAUpperWrite;
        } else if (index < 40960) {
            this.memoryWriter[index] = this.cGBC ? this.VRAMGBCCHRMAPWrite : this.VRAMGBCHRMAPWrite;
        } else if (index < 49152) {
            if (this.numRAMBanks == 1 / 16 && index < 41472 || this.numRAMBanks >= 1) {
                if (!this.cMBC3) {
                    this.memoryWriter[index] = this.memoryWriteMBCRAM;
                } else {
                    this.memoryWriter[index] = this.memoryWriteMBC3RAM;
                }
            } else {
                this.memoryWriter[index] = this.cartIgnoreWrite;
            }
        } else if (index < 57344) {
            if (this.cGBC && index >= 53248) {
                this.memoryWriter[index] = this.memoryWriteGBCRAM;
            } else {
                this.memoryWriter[index] = this.memoryWriteNormal;
            }
        } else if (index < 65024) {
            if (this.cGBC && index >= 61440) {
                this.memoryWriter[index] = this.memoryWriteECHOGBCRAM;
            } else {
                this.memoryWriter[index] = this.memoryWriteECHONormal;
            }
        } else if (index <= 65184) {
            this.memoryWriter[index] = this.memoryWriteOAMRAM;
        } else if (index < 65280) {
            if (this.cGBC) {
                this.memoryWriter[index] = this.memoryWriteNormal;
            } else {
                this.memoryWriter[index] = this.cartIgnoreWrite;
            }
        } else {
            this.memoryWriter[index] = this.memoryWriteNormal;
            this.memoryHighWriter[index & 255] = this.memoryHighWriteNormal;
        }
    }
    this.registerWriteJumpCompile();
});
GameBoyCore.prototype.MBCWriteEnable = _wrap_(function (parentObj, address, data) {
    parentObj.MBCRAMBanksEnabled = (data & 15) == 10;
});
GameBoyCore.prototype.MBC1WriteROMBank = _wrap_(function (parentObj, address, data) {
    parentObj.ROMBank1offs = parentObj.ROMBank1offs & 96 | data & 31;
    parentObj.setCurrentMBC1ROMBank();
});
GameBoyCore.prototype.MBC1WriteRAMBank = _wrap_(function (parentObj, address, data) {
    if (parentObj.MBC1Mode) {
        parentObj.currMBCRAMBank = data & 3;
        parentObj.currMBCRAMBankPosition = (parentObj.currMBCRAMBank << 13) - 40960;
    } else {
        parentObj.ROMBank1offs = (data & 3) << 5 | parentObj.ROMBank1offs & 31;
        parentObj.setCurrentMBC1ROMBank();
    }
});
GameBoyCore.prototype.MBC1WriteType = _wrap_(function (parentObj, address, data) {
    parentObj.MBC1Mode = (data & 1) == 1;
    if (parentObj.MBC1Mode) {
        parentObj.ROMBank1offs &= 31;
        parentObj.setCurrentMBC1ROMBank();
    } else {
        parentObj.currMBCRAMBank = 0;
        parentObj.currMBCRAMBankPosition = -40960;
    }
});
GameBoyCore.prototype.MBC2WriteROMBank = _wrap_(function (parentObj, address, data) {
    parentObj.ROMBank1offs = data & 15;
    parentObj.setCurrentMBC2AND3ROMBank();
});
GameBoyCore.prototype.MBC3WriteROMBank = _wrap_(function (parentObj, address, data) {
    parentObj.ROMBank1offs = data & 127;
    parentObj.setCurrentMBC2AND3ROMBank();
});
GameBoyCore.prototype.MBC3WriteRAMBank = _wrap_(function (parentObj, address, data) {
    parentObj.currMBCRAMBank = data;
    if (data < 4) {
        parentObj.currMBCRAMBankPosition = (parentObj.currMBCRAMBank << 13) - 40960;
    }
});
GameBoyCore.prototype.MBC3WriteRTCLatch = _wrap_(function (parentObj, address, data) {
    if (data == 0) {
        parentObj.RTCisLatched = false;
    } else if (!parentObj.RTCisLatched) {
        parentObj.RTCisLatched = true;
        parentObj.latchedSeconds = parentObj.RTCSeconds | 0;
        parentObj.latchedMinutes = parentObj.RTCMinutes;
        parentObj.latchedHours = parentObj.RTCHours;
        parentObj.latchedLDays = parentObj.RTCDays & 255;
        parentObj.latchedHDays = parentObj.RTCDays >> 8;
    }
});
GameBoyCore.prototype.MBC5WriteROMBankLow = _wrap_(function (parentObj, address, data) {
    parentObj.ROMBank1offs = parentObj.ROMBank1offs & 256 | data;
    parentObj.setCurrentMBC5ROMBank();
});
GameBoyCore.prototype.MBC5WriteROMBankHigh = _wrap_(function (parentObj, address, data) {
    parentObj.ROMBank1offs = (data & 1) << 8 | parentObj.ROMBank1offs & 255;
    parentObj.setCurrentMBC5ROMBank();
});
GameBoyCore.prototype.MBC5WriteRAMBank = _wrap_(function (parentObj, address, data) {
    parentObj.currMBCRAMBank = data & 15;
    parentObj.currMBCRAMBankPosition = (parentObj.currMBCRAMBank << 13) - 40960;
});
GameBoyCore.prototype.RUMBLEWriteRAMBank = _wrap_(function (parentObj, address, data) {
    parentObj.currMBCRAMBank = data & 3;
    parentObj.currMBCRAMBankPosition = (parentObj.currMBCRAMBank << 13) - 40960;
});
GameBoyCore.prototype.HuC3WriteRAMBank = _wrap_(function (parentObj, address, data) {
    parentObj.currMBCRAMBank = data & 3;
    parentObj.currMBCRAMBankPosition = (parentObj.currMBCRAMBank << 13) - 40960;
});
GameBoyCore.prototype.cartIgnoreWrite = _wrap_(function (parentObj, address, data) {
});
GameBoyCore.prototype.memoryWriteNormal = _wrap_(function (parentObj, address, data) {
    parentObj.memory[address] = data;
});
GameBoyCore.prototype.memoryHighWriteNormal = _wrap_(function (parentObj, address, data) {
    parentObj.memory[65280 | address] = data;
});
GameBoyCore.prototype.memoryWriteMBCRAM = _wrap_(function (parentObj, address, data) {
    if (parentObj.MBCRAMBanksEnabled || settings[10]) {
        parentObj.MBCRam[address + parentObj.currMBCRAMBankPosition] = data;
    }
});
GameBoyCore.prototype.memoryWriteMBC3RAM = _wrap_(function (parentObj, address, data) {
    if (parentObj.MBCRAMBanksEnabled || settings[10]) {
        switch (parentObj.currMBCRAMBank) {
        case 0:
        case 1:
        case 2:
        case 3:
            parentObj.MBCRam[address + parentObj.currMBCRAMBankPosition] = data;
            break;
        case 8:
            if (data < 60) {
                parentObj.RTCSeconds = data;
            } else {
                cout('(Bank #' + parentObj.currMBCRAMBank + ') RTC write out of range: ' + data, 1);
            }
            break;
        case 9:
            if (data < 60) {
                parentObj.RTCMinutes = data;
            } else {
                cout('(Bank #' + parentObj.currMBCRAMBank + ') RTC write out of range: ' + data, 1);
            }
            break;
        case 10:
            if (data < 24) {
                parentObj.RTCHours = data;
            } else {
                cout('(Bank #' + parentObj.currMBCRAMBank + ') RTC write out of range: ' + data, 1);
            }
            break;
        case 11:
            parentObj.RTCDays = data & 255 | parentObj.RTCDays & 256;
            break;
        case 12:
            parentObj.RTCDayOverFlow = data > 127;
            parentObj.RTCHalt = (data & 64) == 64;
            parentObj.RTCDays = (data & 1) << 8 | parentObj.RTCDays & 255;
            break;
        default:
            cout('Invalid MBC3 bank address selected: ' + parentObj.currMBCRAMBank, 0);
        }
    }
});
GameBoyCore.prototype.memoryWriteGBCRAM = _wrap_(function (parentObj, address, data) {
    parentObj.GBCMemory[address + parentObj.gbcRamBankPosition] = data;
});
GameBoyCore.prototype.memoryWriteOAMRAM = _wrap_(function (parentObj, address, data) {
    if (parentObj.modeSTAT < 2) {
        if (parentObj.memory[address] != data) {
            parentObj.graphicsJIT();
            parentObj.memory[address] = data;
        }
    }
});
GameBoyCore.prototype.memoryWriteECHOGBCRAM = _wrap_(function (parentObj, address, data) {
    parentObj.GBCMemory[address + parentObj.gbcRamBankPositionECHO] = data;
});
GameBoyCore.prototype.memoryWriteECHONormal = _wrap_(function (parentObj, address, data) {
    parentObj.memory[address - 8192] = data;
});
GameBoyCore.prototype.VRAMGBDATAWrite = _wrap_(function (parentObj, address, data) {
    if (parentObj.modeSTAT < 3) {
        if (parentObj.memory[address] != data) {
            parentObj.graphicsJIT();
            parentObj.memory[address] = data;
            parentObj.generateGBOAMTileLine(address);
        }
    }
});
GameBoyCore.prototype.VRAMGBDATAUpperWrite = _wrap_(function (parentObj, address, data) {
    if (parentObj.modeSTAT < 3) {
        if (parentObj.memory[address] != data) {
            parentObj.graphicsJIT();
            parentObj.memory[address] = data;
            parentObj.generateGBTileLine(address);
        }
    }
});
GameBoyCore.prototype.VRAMGBCDATAWrite = _wrap_(function (parentObj, address, data) {
    if (parentObj.modeSTAT < 3) {
        if (parentObj.currVRAMBank == 0) {
            if (parentObj.memory[address] != data) {
                parentObj.graphicsJIT();
                parentObj.memory[address] = data;
                parentObj.generateGBCTileLineBank1(address);
            }
        } else {
            address &= 8191;
            if (parentObj.VRAM[address] != data) {
                parentObj.graphicsJIT();
                parentObj.VRAM[address] = data;
                parentObj.generateGBCTileLineBank2(address);
            }
        }
    }
});
GameBoyCore.prototype.VRAMGBCHRMAPWrite = _wrap_(function (parentObj, address, data) {
    if (parentObj.modeSTAT < 3) {
        address &= 2047;
        if (parentObj.BGCHRBank1[address] != data) {
            parentObj.graphicsJIT();
            parentObj.BGCHRBank1[address] = data;
        }
    }
});
GameBoyCore.prototype.VRAMGBCCHRMAPWrite = _wrap_(function (parentObj, address, data) {
    if (parentObj.modeSTAT < 3) {
        address &= 2047;
        if (parentObj.BGCHRCurrentBank[address] != data) {
            parentObj.graphicsJIT();
            parentObj.BGCHRCurrentBank[address] = data;
        }
    }
});
GameBoyCore.prototype.DMAWrite = _wrap_(function (tilesToTransfer) {
    if (!this.halt) {
        this.CPUTicks += 4 | tilesToTransfer << 5 << this.doubleSpeedShifter;
    }
    var source = this.memory[65361] << 8 | this.memory[65362];
    var destination = this.memory[65363] << 8 | this.memory[65364];
    var memoryReader = this.memoryReader;
    this.graphicsJIT();
    var memory = this.memory;
    if (this.currVRAMBank == 0) {
        do {
            if (destination < 6144) {
                memory[32768 | destination] = memoryReader[source](this, source++);
                memory[32769 | destination] = memoryReader[source](this, source++);
                memory[32770 | destination] = memoryReader[source](this, source++);
                memory[32771 | destination] = memoryReader[source](this, source++);
                memory[32772 | destination] = memoryReader[source](this, source++);
                memory[32773 | destination] = memoryReader[source](this, source++);
                memory[32774 | destination] = memoryReader[source](this, source++);
                memory[32775 | destination] = memoryReader[source](this, source++);
                memory[32776 | destination] = memoryReader[source](this, source++);
                memory[32777 | destination] = memoryReader[source](this, source++);
                memory[32778 | destination] = memoryReader[source](this, source++);
                memory[32779 | destination] = memoryReader[source](this, source++);
                memory[32780 | destination] = memoryReader[source](this, source++);
                memory[32781 | destination] = memoryReader[source](this, source++);
                memory[32782 | destination] = memoryReader[source](this, source++);
                memory[32783 | destination] = memoryReader[source](this, source++);
                this.generateGBCTileBank1(destination);
                destination += 16;
            } else {
                destination &= 2032;
                this.BGCHRBank1[destination++] = memoryReader[source](this, source++);
                this.BGCHRBank1[destination++] = memoryReader[source](this, source++);
                this.BGCHRBank1[destination++] = memoryReader[source](this, source++);
                this.BGCHRBank1[destination++] = memoryReader[source](this, source++);
                this.BGCHRBank1[destination++] = memoryReader[source](this, source++);
                this.BGCHRBank1[destination++] = memoryReader[source](this, source++);
                this.BGCHRBank1[destination++] = memoryReader[source](this, source++);
                this.BGCHRBank1[destination++] = memoryReader[source](this, source++);
                this.BGCHRBank1[destination++] = memoryReader[source](this, source++);
                this.BGCHRBank1[destination++] = memoryReader[source](this, source++);
                this.BGCHRBank1[destination++] = memoryReader[source](this, source++);
                this.BGCHRBank1[destination++] = memoryReader[source](this, source++);
                this.BGCHRBank1[destination++] = memoryReader[source](this, source++);
                this.BGCHRBank1[destination++] = memoryReader[source](this, source++);
                this.BGCHRBank1[destination++] = memoryReader[source](this, source++);
                this.BGCHRBank1[destination++] = memoryReader[source](this, source++);
                destination = destination + 6144 & 8176;
            }
            source &= 65520;
            --tilesToTransfer;
        } while (tilesToTransfer > 0);
    } else {
        var VRAM = this.VRAM;
        do {
            if (destination < 6144) {
                VRAM[destination] = memoryReader[source](this, source++);
                VRAM[destination | 1] = memoryReader[source](this, source++);
                VRAM[destination | 2] = memoryReader[source](this, source++);
                VRAM[destination | 3] = memoryReader[source](this, source++);
                VRAM[destination | 4] = memoryReader[source](this, source++);
                VRAM[destination | 5] = memoryReader[source](this, source++);
                VRAM[destination | 6] = memoryReader[source](this, source++);
                VRAM[destination | 7] = memoryReader[source](this, source++);
                VRAM[destination | 8] = memoryReader[source](this, source++);
                VRAM[destination | 9] = memoryReader[source](this, source++);
                VRAM[destination | 10] = memoryReader[source](this, source++);
                VRAM[destination | 11] = memoryReader[source](this, source++);
                VRAM[destination | 12] = memoryReader[source](this, source++);
                VRAM[destination | 13] = memoryReader[source](this, source++);
                VRAM[destination | 14] = memoryReader[source](this, source++);
                VRAM[destination | 15] = memoryReader[source](this, source++);
                this.generateGBCTileBank2(destination);
                destination += 16;
            } else {
                destination &= 2032;
                this.BGCHRBank2[destination++] = memoryReader[source](this, source++);
                this.BGCHRBank2[destination++] = memoryReader[source](this, source++);
                this.BGCHRBank2[destination++] = memoryReader[source](this, source++);
                this.BGCHRBank2[destination++] = memoryReader[source](this, source++);
                this.BGCHRBank2[destination++] = memoryReader[source](this, source++);
                this.BGCHRBank2[destination++] = memoryReader[source](this, source++);
                this.BGCHRBank2[destination++] = memoryReader[source](this, source++);
                this.BGCHRBank2[destination++] = memoryReader[source](this, source++);
                this.BGCHRBank2[destination++] = memoryReader[source](this, source++);
                this.BGCHRBank2[destination++] = memoryReader[source](this, source++);
                this.BGCHRBank2[destination++] = memoryReader[source](this, source++);
                this.BGCHRBank2[destination++] = memoryReader[source](this, source++);
                this.BGCHRBank2[destination++] = memoryReader[source](this, source++);
                this.BGCHRBank2[destination++] = memoryReader[source](this, source++);
                this.BGCHRBank2[destination++] = memoryReader[source](this, source++);
                this.BGCHRBank2[destination++] = memoryReader[source](this, source++);
                destination = destination + 6144 & 8176;
            }
            source &= 65520;
            --tilesToTransfer;
        } while (tilesToTransfer > 0);
    }
    memory[65361] = source >> 8;
    memory[65362] = source & 240;
    memory[65363] = destination >> 8;
    memory[65364] = destination & 240;
});
GameBoyCore.prototype.registerWriteJumpCompile = _wrap_(function () {
    this.memoryHighWriter[0] = this.memoryWriter[65280] = _wrap_(function (parentObj, address, data) {
        parentObj.memory[65280] = data & 48 | ((data & 32) == 0 ? parentObj.JoyPad >> 4 : 15) & ((data & 16) == 0 ? parentObj.JoyPad & 15 : 15);
    });
    this.memoryHighWriter[1] = this.memoryWriter[65281] = _wrap_(function (parentObj, address, data) {
        if (parentObj.memory[65282] < 128) {
            parentObj.memory[65281] = data;
        }
    });
    this.memoryHighWriter[4] = this.memoryWriter[65284] = _wrap_(function (parentObj, address, data) {
        parentObj.DIVTicks &= 255;
        parentObj.memory[65284] = 0;
    });
    this.memoryHighWriter[5] = this.memoryWriter[65285] = _wrap_(function (parentObj, address, data) {
        parentObj.memory[65285] = data;
    });
    this.memoryHighWriter[6] = this.memoryWriter[65286] = _wrap_(function (parentObj, address, data) {
        parentObj.memory[65286] = data;
    });
    this.memoryHighWriter[7] = this.memoryWriter[65287] = _wrap_(function (parentObj, address, data) {
        parentObj.memory[65287] = data & 7;
        parentObj.TIMAEnabled = (data & 4) == 4;
        parentObj.TACClocker = Math.pow(4, (data & 3) != 0 ? data & 3 : 4) << 2;
    });
    this.memoryHighWriter[15] = this.memoryWriter[65295] = _wrap_(function (parentObj, address, data) {
        parentObj.interruptsRequested = data;
        parentObj.checkIRQMatching();
    });
    this.memoryHighWriter[16] = this.memoryWriter[65296] = _wrap_(function (parentObj, address, data) {
        if (parentObj.soundMasterEnabled) {
            parentObj.audioJIT();
            if (parentObj.channel1decreaseSweep && (data & 8) == 0) {
                if (parentObj.channel1numSweep != parentObj.channel1frequencySweepDivider) {
                    parentObj.channel1SweepFault = true;
                }
            }
            parentObj.channel1lastTimeSweep = (data & 112) >> 4;
            parentObj.channel1frequencySweepDivider = data & 7;
            parentObj.channel1decreaseSweep = (data & 8) == 8;
            parentObj.memory[65296] = data;
            parentObj.channel1EnableCheck();
        }
    });
    this.memoryHighWriter[17] = this.memoryWriter[65297] = _wrap_(function (parentObj, address, data) {
        if (parentObj.soundMasterEnabled || !parentObj.cGBC) {
            if (parentObj.soundMasterEnabled) {
                parentObj.audioJIT();
            } else {
                data &= 63;
            }
            parentObj.channel1CachedDuty = parentObj.dutyLookup[data >> 6];
            parentObj.channel1totalLength = 64 - (data & 63);
            parentObj.memory[65297] = data & 192;
            parentObj.channel1EnableCheck();
        }
    });
    this.memoryHighWriter[18] = this.memoryWriter[65298] = _wrap_(function (parentObj, address, data) {
        if (parentObj.soundMasterEnabled) {
            parentObj.audioJIT();
            if (parentObj.channel1Enabled && parentObj.channel1envelopeSweeps == 0) {
                if (((parentObj.memory[65298] ^ data) & 8) == 8) {
                    if ((parentObj.memory[65298] & 8) == 0) {
                        if ((parentObj.memory[65298] & 7) == 7) {
                            parentObj.channel1envelopeVolume += 2;
                        } else {
                            ++parentObj.channel1envelopeVolume;
                        }
                    }
                    parentObj.channel1envelopeVolume = 16 - parentObj.channel1envelopeVolume & 15;
                } else if ((parentObj.memory[65298] & 15) == 8) {
                    parentObj.channel1envelopeVolume = 1 + parentObj.channel1envelopeVolume & 15;
                }
                parentObj.channel1OutputLevelCache();
            }
            parentObj.channel1envelopeType = (data & 8) == 8;
            parentObj.memory[65298] = data;
            parentObj.channel1VolumeEnableCheck();
        }
    });
    this.memoryHighWriter[19] = this.memoryWriter[65299] = _wrap_(function (parentObj, address, data) {
        if (parentObj.soundMasterEnabled) {
            parentObj.audioJIT();
            parentObj.channel1frequency = parentObj.channel1frequency & 1792 | data;
            parentObj.channel1FrequencyTracker = 2048 - parentObj.channel1frequency << 2;
            parentObj.memory[65299] = data;
        }
    });
    this.memoryHighWriter[20] = this.memoryWriter[65300] = _wrap_(function (parentObj, address, data) {
        if (parentObj.soundMasterEnabled) {
            parentObj.audioJIT();
            parentObj.channel1consecutive = (data & 64) == 0;
            parentObj.channel1frequency = (data & 7) << 8 | parentObj.channel1frequency & 255;
            parentObj.channel1FrequencyTracker = 2048 - parentObj.channel1frequency << 2;
            if (data > 127) {
                parentObj.channel1timeSweep = parentObj.channel1lastTimeSweep;
                parentObj.channel1numSweep = parentObj.channel1frequencySweepDivider;
                var nr12 = parentObj.memory[65298];
                parentObj.channel1envelopeVolume = nr12 >> 4;
                parentObj.channel1OutputLevelCache();
                parentObj.channel1envelopeSweepsLast = (nr12 & 7) - 1;
                if (parentObj.channel1totalLength == 0) {
                    parentObj.channel1totalLength = 64;
                }
                if (parentObj.channel1lastTimeSweep > 0 || parentObj.channel1frequencySweepDivider > 0) {
                    parentObj.memory[65318] |= 1;
                } else {
                    parentObj.memory[65318] &= 254;
                }
                if ((data & 64) == 64) {
                    parentObj.memory[65318] |= 1;
                }
                parentObj.channel1ShadowFrequency = parentObj.channel1frequency;
                parentObj.channel1SweepFault = false;
                parentObj.runAudioSweep();
            }
            parentObj.channel1EnableCheck();
            parentObj.memory[65300] = data & 64;
        }
    });
    this.memoryHighWriter[22] = this.memoryWriter[65302] = _wrap_(function (parentObj, address, data) {
        if (parentObj.soundMasterEnabled || !parentObj.cGBC) {
            if (parentObj.soundMasterEnabled) {
                parentObj.audioJIT();
            } else {
                data &= 63;
            }
            parentObj.channel2CachedDuty = parentObj.dutyLookup[data >> 6];
            parentObj.channel2totalLength = 64 - (data & 63);
            parentObj.memory[65302] = data & 192;
            parentObj.channel2EnableCheck();
        }
    });
    this.memoryHighWriter[23] = this.memoryWriter[65303] = _wrap_(function (parentObj, address, data) {
        if (parentObj.soundMasterEnabled) {
            parentObj.audioJIT();
            if (parentObj.channel2Enabled && parentObj.channel2envelopeSweeps == 0) {
                if (((parentObj.memory[65303] ^ data) & 8) == 8) {
                    if ((parentObj.memory[65303] & 8) == 0) {
                        if ((parentObj.memory[65303] & 7) == 7) {
                            parentObj.channel2envelopeVolume += 2;
                        } else {
                            ++parentObj.channel2envelopeVolume;
                        }
                    }
                    parentObj.channel2envelopeVolume = 16 - parentObj.channel2envelopeVolume & 15;
                } else if ((parentObj.memory[65303] & 15) == 8) {
                    parentObj.channel2envelopeVolume = 1 + parentObj.channel2envelopeVolume & 15;
                }
                parentObj.channel2OutputLevelCache();
            }
            parentObj.channel2envelopeType = (data & 8) == 8;
            parentObj.memory[65303] = data;
            parentObj.channel2VolumeEnableCheck();
        }
    });
    this.memoryHighWriter[24] = this.memoryWriter[65304] = _wrap_(function (parentObj, address, data) {
        if (parentObj.soundMasterEnabled) {
            parentObj.audioJIT();
            parentObj.channel2frequency = parentObj.channel2frequency & 1792 | data;
            parentObj.channel2FrequencyTracker = 2048 - parentObj.channel2frequency << 2;
            parentObj.memory[65304] = data;
        }
    });
    this.memoryHighWriter[25] = this.memoryWriter[65305] = _wrap_(function (parentObj, address, data) {
        if (parentObj.soundMasterEnabled) {
            parentObj.audioJIT();
            if (data > 127) {
                var nr22 = parentObj.memory[65303];
                parentObj.channel2envelopeVolume = nr22 >> 4;
                parentObj.channel2OutputLevelCache();
                parentObj.channel2envelopeSweepsLast = (nr22 & 7) - 1;
                if (parentObj.channel2totalLength == 0) {
                    parentObj.channel2totalLength = 64;
                }
                if ((data & 64) == 64) {
                    parentObj.memory[65318] |= 2;
                }
            }
            parentObj.channel2consecutive = (data & 64) == 0;
            parentObj.channel2frequency = (data & 7) << 8 | parentObj.channel2frequency & 255;
            parentObj.channel2FrequencyTracker = 2048 - parentObj.channel2frequency << 2;
            parentObj.memory[65305] = data & 64;
            parentObj.channel2EnableCheck();
        }
    });
    this.memoryHighWriter[26] = this.memoryWriter[65306] = _wrap_(function (parentObj, address, data) {
        if (parentObj.soundMasterEnabled) {
            parentObj.audioJIT();
            if (!parentObj.channel3canPlay && data >= 128) {
                parentObj.channel3lastSampleLookup = 0;
                parentObj.channel3UpdateCache();
            }
            parentObj.channel3canPlay = data > 127;
            if (parentObj.channel3canPlay && parentObj.memory[65306] > 127 && !parentObj.channel3consecutive) {
                parentObj.memory[65318] |= 4;
            }
            parentObj.memory[65306] = data & 128;
        }
    });
    this.memoryHighWriter[27] = this.memoryWriter[65307] = _wrap_(function (parentObj, address, data) {
        if (parentObj.soundMasterEnabled || !parentObj.cGBC) {
            if (parentObj.soundMasterEnabled) {
                parentObj.audioJIT();
            }
            parentObj.channel3totalLength = 256 - data;
            parentObj.memory[65307] = data;
            parentObj.channel3EnableCheck();
        }
    });
    this.memoryHighWriter[28] = this.memoryWriter[65308] = _wrap_(function (parentObj, address, data) {
        if (parentObj.soundMasterEnabled) {
            parentObj.audioJIT();
            data &= 96;
            parentObj.memory[65308] = data;
            parentObj.channel3patternType = data == 0 ? 4 : (data >> 5) - 1;
        }
    });
    this.memoryHighWriter[29] = this.memoryWriter[65309] = _wrap_(function (parentObj, address, data) {
        if (parentObj.soundMasterEnabled) {
            parentObj.audioJIT();
            parentObj.channel3frequency = parentObj.channel3frequency & 1792 | data;
            parentObj.channel3FrequencyPeriod = 2048 - parentObj.channel3frequency << 1;
            parentObj.memory[65309] = data;
        }
    });
    this.memoryHighWriter[30] = this.memoryWriter[65310] = _wrap_(function (parentObj, address, data) {
        if (parentObj.soundMasterEnabled) {
            parentObj.audioJIT();
            if (data > 127) {
                if (parentObj.channel3totalLength == 0) {
                    parentObj.channel3totalLength = 256;
                }
                parentObj.channel3lastSampleLookup = 0;
                if ((data & 64) == 64) {
                    parentObj.memory[65318] |= 4;
                }
            }
            parentObj.channel3consecutive = (data & 64) == 0;
            parentObj.channel3frequency = (data & 7) << 8 | parentObj.channel3frequency & 255;
            parentObj.channel3FrequencyPeriod = 2048 - parentObj.channel3frequency << 1;
            parentObj.memory[65310] = data & 64;
            parentObj.channel3EnableCheck();
        }
    });
    this.memoryHighWriter[32] = this.memoryWriter[65312] = _wrap_(function (parentObj, address, data) {
        if (parentObj.soundMasterEnabled || !parentObj.cGBC) {
            if (parentObj.soundMasterEnabled) {
                parentObj.audioJIT();
            }
            parentObj.channel4totalLength = 64 - (data & 63);
            parentObj.memory[65312] = data | 192;
            parentObj.channel4EnableCheck();
        }
    });
    this.memoryHighWriter[33] = this.memoryWriter[65313] = _wrap_(function (parentObj, address, data) {
        if (parentObj.soundMasterEnabled) {
            parentObj.audioJIT();
            if (parentObj.channel4Enabled && parentObj.channel4envelopeSweeps == 0) {
                if (((parentObj.memory[65313] ^ data) & 8) == 8) {
                    if ((parentObj.memory[65313] & 8) == 0) {
                        if ((parentObj.memory[65313] & 7) == 7) {
                            parentObj.channel4envelopeVolume += 2;
                        } else {
                            ++parentObj.channel4envelopeVolume;
                        }
                    }
                    parentObj.channel4envelopeVolume = 16 - parentObj.channel4envelopeVolume & 15;
                } else if ((parentObj.memory[65313] & 15) == 8) {
                    parentObj.channel4envelopeVolume = 1 + parentObj.channel4envelopeVolume & 15;
                }
                parentObj.channel4currentVolume = parentObj.channel4envelopeVolume << parentObj.channel4VolumeShifter;
            }
            parentObj.channel4envelopeType = (data & 8) == 8;
            parentObj.memory[65313] = data;
            parentObj.channel4UpdateCache();
            parentObj.channel4VolumeEnableCheck();
        }
    });
    this.memoryHighWriter[34] = this.memoryWriter[65314] = _wrap_(function (parentObj, address, data) {
        if (parentObj.soundMasterEnabled) {
            parentObj.audioJIT();
            parentObj.channel4FrequencyPeriod = Math.max((data & 7) << 4, 8) << (data >> 4);
            var bitWidth = data & 8;
            if (bitWidth == 8 && parentObj.channel4BitRange == 32767 || bitWidth == 0 && parentObj.channel4BitRange == 127) {
                parentObj.channel4lastSampleLookup = 0;
                parentObj.channel4BitRange = bitWidth == 8 ? 127 : 32767;
                parentObj.channel4VolumeShifter = bitWidth == 8 ? 7 : 15;
                parentObj.channel4currentVolume = parentObj.channel4envelopeVolume << parentObj.channel4VolumeShifter;
                parentObj.noiseSampleTable = bitWidth == 8 ? parentObj.LSFR7Table : parentObj.LSFR15Table;
            }
            parentObj.memory[65314] = data;
            parentObj.channel4UpdateCache();
        }
    });
    this.memoryHighWriter[35] = this.memoryWriter[65315] = _wrap_(function (parentObj, address, data) {
        if (parentObj.soundMasterEnabled) {
            parentObj.audioJIT();
            parentObj.memory[65315] = data;
            parentObj.channel4consecutive = (data & 64) == 0;
            if (data > 127) {
                var nr42 = parentObj.memory[65313];
                parentObj.channel4envelopeVolume = nr42 >> 4;
                parentObj.channel4currentVolume = parentObj.channel4envelopeVolume << parentObj.channel4VolumeShifter;
                parentObj.channel4envelopeSweepsLast = (nr42 & 7) - 1;
                if (parentObj.channel4totalLength == 0) {
                    parentObj.channel4totalLength = 64;
                }
                if ((data & 64) == 64) {
                    parentObj.memory[65318] |= 8;
                }
            }
            parentObj.channel4EnableCheck();
        }
    });
    this.memoryHighWriter[36] = this.memoryWriter[65316] = _wrap_(function (parentObj, address, data) {
        if (parentObj.soundMasterEnabled && parentObj.memory[65316] != data) {
            parentObj.audioJIT();
            parentObj.memory[65316] = data;
            parentObj.VinLeftChannelMasterVolume = (data >> 4 & 7) + 1;
            parentObj.VinRightChannelMasterVolume = (data & 7) + 1;
            parentObj.mixerOutputLevelCache();
        }
    });
    this.memoryHighWriter[37] = this.memoryWriter[65317] = _wrap_(function (parentObj, address, data) {
        if (parentObj.soundMasterEnabled && parentObj.memory[65317] != data) {
            parentObj.audioJIT();
            parentObj.memory[65317] = data;
            parentObj.rightChannel1 = (data & 1) == 1;
            parentObj.rightChannel2 = (data & 2) == 2;
            parentObj.rightChannel3 = (data & 4) == 4;
            parentObj.rightChannel4 = (data & 8) == 8;
            parentObj.leftChannel1 = (data & 16) == 16;
            parentObj.leftChannel2 = (data & 32) == 32;
            parentObj.leftChannel3 = (data & 64) == 64;
            parentObj.leftChannel4 = data > 127;
            parentObj.channel1OutputLevelCache();
            parentObj.channel2OutputLevelCache();
            parentObj.channel3OutputLevelCache();
            parentObj.channel4OutputLevelCache();
        }
    });
    this.memoryHighWriter[38] = this.memoryWriter[65318] = _wrap_(function (parentObj, address, data) {
        parentObj.audioJIT();
        if (!parentObj.soundMasterEnabled && data > 127) {
            parentObj.memory[65318] = 128;
            parentObj.soundMasterEnabled = true;
            parentObj.initializeAudioStartState();
        } else if (parentObj.soundMasterEnabled && data < 128) {
            parentObj.memory[65318] = 0;
            parentObj.soundMasterEnabled = false;
            for (var index = 65296; index < 65318; index++) {
                parentObj.memoryWriter[index](parentObj, index, 0);
            }
        }
    });
    this.memoryHighWriter[39] = this.memoryWriter[65319] = this.cartIgnoreWrite;
    this.memoryHighWriter[40] = this.memoryWriter[65320] = this.cartIgnoreWrite;
    this.memoryHighWriter[41] = this.memoryWriter[65321] = this.cartIgnoreWrite;
    this.memoryHighWriter[42] = this.memoryWriter[65322] = this.cartIgnoreWrite;
    this.memoryHighWriter[43] = this.memoryWriter[65323] = this.cartIgnoreWrite;
    this.memoryHighWriter[44] = this.memoryWriter[65324] = this.cartIgnoreWrite;
    this.memoryHighWriter[45] = this.memoryWriter[65325] = this.cartIgnoreWrite;
    this.memoryHighWriter[46] = this.memoryWriter[65326] = this.cartIgnoreWrite;
    this.memoryHighWriter[47] = this.memoryWriter[65327] = this.cartIgnoreWrite;
    this.memoryHighWriter[48] = this.memoryWriter[65328] = _wrap_(function (parentObj, address, data) {
        parentObj.channel3WriteRAM(0, data);
    });
    this.memoryHighWriter[49] = this.memoryWriter[65329] = _wrap_(function (parentObj, address, data) {
        parentObj.channel3WriteRAM(1, data);
    });
    this.memoryHighWriter[50] = this.memoryWriter[65330] = _wrap_(function (parentObj, address, data) {
        parentObj.channel3WriteRAM(2, data);
    });
    this.memoryHighWriter[51] = this.memoryWriter[65331] = _wrap_(function (parentObj, address, data) {
        parentObj.channel3WriteRAM(3, data);
    });
    this.memoryHighWriter[52] = this.memoryWriter[65332] = _wrap_(function (parentObj, address, data) {
        parentObj.channel3WriteRAM(4, data);
    });
    this.memoryHighWriter[53] = this.memoryWriter[65333] = _wrap_(function (parentObj, address, data) {
        parentObj.channel3WriteRAM(5, data);
    });
    this.memoryHighWriter[54] = this.memoryWriter[65334] = _wrap_(function (parentObj, address, data) {
        parentObj.channel3WriteRAM(6, data);
    });
    this.memoryHighWriter[55] = this.memoryWriter[65335] = _wrap_(function (parentObj, address, data) {
        parentObj.channel3WriteRAM(7, data);
    });
    this.memoryHighWriter[56] = this.memoryWriter[65336] = _wrap_(function (parentObj, address, data) {
        parentObj.channel3WriteRAM(8, data);
    });
    this.memoryHighWriter[57] = this.memoryWriter[65337] = _wrap_(function (parentObj, address, data) {
        parentObj.channel3WriteRAM(9, data);
    });
    this.memoryHighWriter[58] = this.memoryWriter[65338] = _wrap_(function (parentObj, address, data) {
        parentObj.channel3WriteRAM(10, data);
    });
    this.memoryHighWriter[59] = this.memoryWriter[65339] = _wrap_(function (parentObj, address, data) {
        parentObj.channel3WriteRAM(11, data);
    });
    this.memoryHighWriter[60] = this.memoryWriter[65340] = _wrap_(function (parentObj, address, data) {
        parentObj.channel3WriteRAM(12, data);
    });
    this.memoryHighWriter[61] = this.memoryWriter[65341] = _wrap_(function (parentObj, address, data) {
        parentObj.channel3WriteRAM(13, data);
    });
    this.memoryHighWriter[62] = this.memoryWriter[65342] = _wrap_(function (parentObj, address, data) {
        parentObj.channel3WriteRAM(14, data);
    });
    this.memoryHighWriter[63] = this.memoryWriter[65343] = _wrap_(function (parentObj, address, data) {
        parentObj.channel3WriteRAM(15, data);
    });
    this.memoryHighWriter[66] = this.memoryWriter[65346] = _wrap_(function (parentObj, address, data) {
        if (parentObj.backgroundY != data) {
            parentObj.midScanLineJIT();
            parentObj.backgroundY = data;
        }
    });
    this.memoryHighWriter[67] = this.memoryWriter[65347] = _wrap_(function (parentObj, address, data) {
        if (parentObj.backgroundX != data) {
            parentObj.midScanLineJIT();
            parentObj.backgroundX = data;
        }
    });
    this.memoryHighWriter[68] = this.memoryWriter[65348] = _wrap_(function (parentObj, address, data) {
        if (parentObj.LCDisOn) {
            parentObj.modeSTAT = 2;
            parentObj.midScanlineOffset = -1;
            parentObj.totalLinesPassed = parentObj.currentX = parentObj.queuedScanLines = parentObj.lastUnrenderedLine = parentObj.LCDTicks = parentObj.STATTracker = parentObj.actualScanLine = parentObj.memory[65348] = 0;
        }
    });
    this.memoryHighWriter[69] = this.memoryWriter[65349] = _wrap_(function (parentObj, address, data) {
        if (parentObj.memory[65349] != data) {
            parentObj.memory[65349] = data;
            if (parentObj.LCDisOn) {
                parentObj.matchLYC();
            }
        }
    });
    this.memoryHighWriter[74] = this.memoryWriter[65354] = _wrap_(function (parentObj, address, data) {
        if (parentObj.windowY != data) {
            parentObj.midScanLineJIT();
            parentObj.windowY = data;
        }
    });
    this.memoryHighWriter[75] = this.memoryWriter[65355] = _wrap_(function (parentObj, address, data) {
        if (parentObj.memory[65355] != data) {
            parentObj.midScanLineJIT();
            parentObj.memory[65355] = data;
            parentObj.windowX = data - 7;
        }
    });
    this.memoryHighWriter[114] = this.memoryWriter[65394] = _wrap_(function (parentObj, address, data) {
        parentObj.memory[65394] = data;
    });
    this.memoryHighWriter[115] = this.memoryWriter[65395] = _wrap_(function (parentObj, address, data) {
        parentObj.memory[65395] = data;
    });
    this.memoryHighWriter[117] = this.memoryWriter[65397] = _wrap_(function (parentObj, address, data) {
        parentObj.memory[65397] = data;
    });
    this.memoryHighWriter[118] = this.memoryWriter[65398] = this.cartIgnoreWrite;
    this.memoryHighWriter[119] = this.memoryWriter[65399] = this.cartIgnoreWrite;
    this.memoryHighWriter[255] = this.memoryWriter[65535] = _wrap_(function (parentObj, address, data) {
        parentObj.interruptsEnabled = data;
        parentObj.checkIRQMatching();
    });
    this.recompileModelSpecificIOWriteHandling();
    this.recompileBootIOWriteHandling();
});
GameBoyCore.prototype.recompileModelSpecificIOWriteHandling = _wrap_(function () {
    if (this.cGBC) {
        this.memoryHighWriter[2] = this.memoryWriter[65282] = _wrap_(function (parentObj, address, data) {
            if ((data & 1) == 1) {
                parentObj.memory[65282] = data & 127;
                parentObj.serialTimer = (data & 2) == 0 ? 4096 : 128;
                parentObj.serialShiftTimer = parentObj.serialShiftTimerAllocated = (data & 2) == 0 ? 512 : 16;
            } else {
                parentObj.memory[65282] = data;
                parentObj.serialShiftTimer = parentObj.serialShiftTimerAllocated = parentObj.serialTimer = 0;
            }
        });
        this.memoryHighWriter[64] = this.memoryWriter[65344] = _wrap_(function (parentObj, address, data) {
            if (parentObj.memory[65344] != data) {
                parentObj.midScanLineJIT();
                var temp_var = data > 127;
                if (temp_var != parentObj.LCDisOn) {
                    parentObj.LCDisOn = temp_var;
                    parentObj.memory[65345] &= 120;
                    parentObj.midScanlineOffset = -1;
                    parentObj.totalLinesPassed = parentObj.currentX = parentObj.queuedScanLines = parentObj.lastUnrenderedLine = parentObj.STATTracker = parentObj.LCDTicks = parentObj.actualScanLine = parentObj.memory[65348] = 0;
                    if (parentObj.LCDisOn) {
                        parentObj.modeSTAT = 2;
                        parentObj.matchLYC();
                        parentObj.LCDCONTROL = parentObj.LINECONTROL;
                    } else {
                        parentObj.modeSTAT = 0;
                        parentObj.LCDCONTROL = parentObj.DISPLAYOFFCONTROL;
                        parentObj.DisplayShowOff();
                    }
                    parentObj.interruptsRequested &= 253;
                }
                parentObj.gfxWindowCHRBankPosition = (data & 64) == 64 ? 1024 : 0;
                parentObj.gfxWindowDisplay = (data & 32) == 32;
                parentObj.gfxBackgroundBankOffset = (data & 16) == 16 ? 0 : 128;
                parentObj.gfxBackgroundCHRBankPosition = (data & 8) == 8 ? 1024 : 0;
                parentObj.gfxSpriteNormalHeight = (data & 4) == 0;
                parentObj.gfxSpriteShow = (data & 2) == 2;
                parentObj.BGPriorityEnabled = (data & 1) == 1;
                parentObj.priorityFlaggingPathRebuild();
                parentObj.memory[65344] = data;
            }
        });
        this.memoryHighWriter[65] = this.memoryWriter[65345] = _wrap_(function (parentObj, address, data) {
            parentObj.LYCMatchTriggerSTAT = (data & 64) == 64;
            parentObj.mode2TriggerSTAT = (data & 32) == 32;
            parentObj.mode1TriggerSTAT = (data & 16) == 16;
            parentObj.mode0TriggerSTAT = (data & 8) == 8;
            parentObj.memory[65345] = data & 120;
        });
        this.memoryHighWriter[70] = this.memoryWriter[65350] = _wrap_(function (parentObj, address, data) {
            parentObj.memory[65350] = data;
            if (data < 224) {
                data <<= 8;
                address = 65024;
                var stat = parentObj.modeSTAT;
                parentObj.modeSTAT = 0;
                var newData = 0;
                do {
                    newData = parentObj.memoryReader[data](parentObj, data++);
                    if (newData != parentObj.memory[address]) {
                        parentObj.modeSTAT = stat;
                        parentObj.graphicsJIT();
                        parentObj.modeSTAT = 0;
                        parentObj.memory[address++] = newData;
                        break;
                    }
                } while (++address < 65184);
                if (address < 65184) {
                    do {
                        parentObj.memory[address++] = parentObj.memoryReader[data](parentObj, data++);
                        parentObj.memory[address++] = parentObj.memoryReader[data](parentObj, data++);
                        parentObj.memory[address++] = parentObj.memoryReader[data](parentObj, data++);
                        parentObj.memory[address++] = parentObj.memoryReader[data](parentObj, data++);
                    } while (address < 65184);
                }
                parentObj.modeSTAT = stat;
            }
        });
        this.memoryHighWriter[77] = this.memoryWriter[65357] = _wrap_(function (parentObj, address, data) {
            parentObj.memory[65357] = data & 127 | parentObj.memory[65357] & 128;
        });
        this.memoryHighWriter[79] = this.memoryWriter[65359] = _wrap_(function (parentObj, address, data) {
            parentObj.currVRAMBank = data & 1;
            if (parentObj.currVRAMBank > 0) {
                parentObj.BGCHRCurrentBank = parentObj.BGCHRBank2;
            } else {
                parentObj.BGCHRCurrentBank = parentObj.BGCHRBank1;
            }
        });
        this.memoryHighWriter[81] = this.memoryWriter[65361] = _wrap_(function (parentObj, address, data) {
            if (!parentObj.hdmaRunning) {
                parentObj.memory[65361] = data;
            }
        });
        this.memoryHighWriter[82] = this.memoryWriter[65362] = _wrap_(function (parentObj, address, data) {
            if (!parentObj.hdmaRunning) {
                parentObj.memory[65362] = data & 240;
            }
        });
        this.memoryHighWriter[83] = this.memoryWriter[65363] = _wrap_(function (parentObj, address, data) {
            if (!parentObj.hdmaRunning) {
                parentObj.memory[65363] = data & 31;
            }
        });
        this.memoryHighWriter[84] = this.memoryWriter[65364] = _wrap_(function (parentObj, address, data) {
            if (!parentObj.hdmaRunning) {
                parentObj.memory[65364] = data & 240;
            }
        });
        this.memoryHighWriter[85] = this.memoryWriter[65365] = _wrap_(function (parentObj, address, data) {
            if (!parentObj.hdmaRunning) {
                if ((data & 128) == 0) {
                    parentObj.DMAWrite((data & 127) + 1);
                    parentObj.memory[65365] = 255;
                } else {
                    parentObj.hdmaRunning = true;
                    parentObj.memory[65365] = data & 127;
                }
            } else if ((data & 128) == 0) {
                parentObj.hdmaRunning = false;
                parentObj.memory[65365] |= 128;
            } else {
                parentObj.memory[65365] = data & 127;
            }
        });
        this.memoryHighWriter[104] = this.memoryWriter[65384] = _wrap_(function (parentObj, address, data) {
            parentObj.memory[65385] = parentObj.gbcBGRawPalette[data & 63];
            parentObj.memory[65384] = data;
        });
        this.memoryHighWriter[105] = this.memoryWriter[65385] = _wrap_(function (parentObj, address, data) {
            parentObj.updateGBCBGPalette(parentObj.memory[65384] & 63, data);
            if (parentObj.memory[65384] > 127) {
                var next = parentObj.memory[65384] + 1 & 63;
                parentObj.memory[65384] = next | 128;
                parentObj.memory[65385] = parentObj.gbcBGRawPalette[next];
            } else {
                parentObj.memory[65385] = data;
            }
        });
        this.memoryHighWriter[106] = this.memoryWriter[65386] = _wrap_(function (parentObj, address, data) {
            parentObj.memory[65387] = parentObj.gbcOBJRawPalette[data & 63];
            parentObj.memory[65386] = data;
        });
        this.memoryHighWriter[107] = this.memoryWriter[65387] = _wrap_(function (parentObj, address, data) {
            parentObj.updateGBCOBJPalette(parentObj.memory[65386] & 63, data);
            if (parentObj.memory[65386] > 127) {
                var next = parentObj.memory[65386] + 1 & 63;
                parentObj.memory[65386] = next | 128;
                parentObj.memory[65387] = parentObj.gbcOBJRawPalette[next];
            } else {
                parentObj.memory[65387] = data;
            }
        });
        this.memoryHighWriter[112] = this.memoryWriter[65392] = _wrap_(function (parentObj, address, data) {
            var addressCheck = parentObj.memory[65361] << 8 | parentObj.memory[65362];
            if (!parentObj.hdmaRunning || addressCheck < 53248 || addressCheck >= 57344) {
                parentObj.gbcRamBank = Math.max(data & 7, 1);
                parentObj.gbcRamBankPosition = (parentObj.gbcRamBank - 1 << 12) - 53248;
                parentObj.gbcRamBankPositionECHO = parentObj.gbcRamBankPosition - 8192;
            }
            parentObj.memory[65392] = data;
        });
        this.memoryHighWriter[116] = this.memoryWriter[65396] = _wrap_(function (parentObj, address, data) {
            parentObj.memory[65396] = data;
        });
    } else {
        this.memoryHighWriter[2] = this.memoryWriter[65282] = _wrap_(function (parentObj, address, data) {
            if ((data & 1) == 1) {
                parentObj.memory[65282] = data & 127;
                parentObj.serialTimer = 4096;
                parentObj.serialShiftTimer = parentObj.serialShiftTimerAllocated = 512;
            } else {
                parentObj.memory[65282] = data;
                parentObj.serialShiftTimer = parentObj.serialShiftTimerAllocated = parentObj.serialTimer = 0;
            }
        });
        this.memoryHighWriter[64] = this.memoryWriter[65344] = _wrap_(function (parentObj, address, data) {
            if (parentObj.memory[65344] != data) {
                parentObj.midScanLineJIT();
                var temp_var = data > 127;
                if (temp_var != parentObj.LCDisOn) {
                    parentObj.LCDisOn = temp_var;
                    parentObj.memory[65345] &= 120;
                    parentObj.midScanlineOffset = -1;
                    parentObj.totalLinesPassed = parentObj.currentX = parentObj.queuedScanLines = parentObj.lastUnrenderedLine = parentObj.STATTracker = parentObj.LCDTicks = parentObj.actualScanLine = parentObj.memory[65348] = 0;
                    if (parentObj.LCDisOn) {
                        parentObj.modeSTAT = 2;
                        parentObj.matchLYC();
                        parentObj.LCDCONTROL = parentObj.LINECONTROL;
                    } else {
                        parentObj.modeSTAT = 0;
                        parentObj.LCDCONTROL = parentObj.DISPLAYOFFCONTROL;
                        parentObj.DisplayShowOff();
                    }
                    parentObj.interruptsRequested &= 253;
                }
                parentObj.gfxWindowCHRBankPosition = (data & 64) == 64 ? 1024 : 0;
                parentObj.gfxWindowDisplay = (data & 32) == 32;
                parentObj.gfxBackgroundBankOffset = (data & 16) == 16 ? 0 : 128;
                parentObj.gfxBackgroundCHRBankPosition = (data & 8) == 8 ? 1024 : 0;
                parentObj.gfxSpriteNormalHeight = (data & 4) == 0;
                parentObj.gfxSpriteShow = (data & 2) == 2;
                parentObj.bgEnabled = (data & 1) == 1;
                parentObj.memory[65344] = data;
            }
        });
        this.memoryHighWriter[65] = this.memoryWriter[65345] = _wrap_(function (parentObj, address, data) {
            parentObj.LYCMatchTriggerSTAT = (data & 64) == 64;
            parentObj.mode2TriggerSTAT = (data & 32) == 32;
            parentObj.mode1TriggerSTAT = (data & 16) == 16;
            parentObj.mode0TriggerSTAT = (data & 8) == 8;
            parentObj.memory[65345] = data & 120;
            if ((!parentObj.usedBootROM || !parentObj.usedGBCBootROM) && parentObj.LCDisOn && parentObj.modeSTAT < 2) {
                parentObj.interruptsRequested |= 2;
                parentObj.checkIRQMatching();
            }
        });
        this.memoryHighWriter[70] = this.memoryWriter[65350] = _wrap_(function (parentObj, address, data) {
            parentObj.memory[65350] = data;
            if (data > 127 && data < 224) {
                data <<= 8;
                address = 65024;
                var stat = parentObj.modeSTAT;
                parentObj.modeSTAT = 0;
                var newData = 0;
                do {
                    newData = parentObj.memoryReader[data](parentObj, data++);
                    if (newData != parentObj.memory[address]) {
                        parentObj.modeSTAT = stat;
                        parentObj.graphicsJIT();
                        parentObj.modeSTAT = 0;
                        parentObj.memory[address++] = newData;
                        break;
                    }
                } while (++address < 65184);
                if (address < 65184) {
                    do {
                        parentObj.memory[address++] = parentObj.memoryReader[data](parentObj, data++);
                        parentObj.memory[address++] = parentObj.memoryReader[data](parentObj, data++);
                        parentObj.memory[address++] = parentObj.memoryReader[data](parentObj, data++);
                        parentObj.memory[address++] = parentObj.memoryReader[data](parentObj, data++);
                    } while (address < 65184);
                }
                parentObj.modeSTAT = stat;
            }
        });
        this.memoryHighWriter[71] = this.memoryWriter[65351] = _wrap_(function (parentObj, address, data) {
            if (parentObj.memory[65351] != data) {
                parentObj.midScanLineJIT();
                parentObj.updateGBBGPalette(data);
                parentObj.memory[65351] = data;
            }
        });
        this.memoryHighWriter[72] = this.memoryWriter[65352] = _wrap_(function (parentObj, address, data) {
            if (parentObj.memory[65352] != data) {
                parentObj.midScanLineJIT();
                parentObj.updateGBOBJPalette(0, data);
                parentObj.memory[65352] = data;
            }
        });
        this.memoryHighWriter[73] = this.memoryWriter[65353] = _wrap_(function (parentObj, address, data) {
            if (parentObj.memory[65353] != data) {
                parentObj.midScanLineJIT();
                parentObj.updateGBOBJPalette(4, data);
                parentObj.memory[65353] = data;
            }
        });
        this.memoryHighWriter[77] = this.memoryWriter[65357] = _wrap_(function (parentObj, address, data) {
            parentObj.memory[65357] = data;
        });
        this.memoryHighWriter[79] = this.memoryWriter[65359] = this.cartIgnoreWrite;
        this.memoryHighWriter[85] = this.memoryWriter[65365] = this.cartIgnoreWrite;
        this.memoryHighWriter[104] = this.memoryWriter[65384] = this.cartIgnoreWrite;
        this.memoryHighWriter[105] = this.memoryWriter[65385] = this.cartIgnoreWrite;
        this.memoryHighWriter[106] = this.memoryWriter[65386] = this.cartIgnoreWrite;
        this.memoryHighWriter[107] = this.memoryWriter[65387] = this.cartIgnoreWrite;
        this.memoryHighWriter[108] = this.memoryWriter[65388] = this.cartIgnoreWrite;
        this.memoryHighWriter[112] = this.memoryWriter[65392] = this.cartIgnoreWrite;
        this.memoryHighWriter[116] = this.memoryWriter[65396] = this.cartIgnoreWrite;
    }
});
GameBoyCore.prototype.recompileBootIOWriteHandling = _wrap_(function () {
    if (this.inBootstrap) {
        this.memoryHighWriter[80] = this.memoryWriter[65360] = _wrap_(function (parentObj, address, data) {
            cout('Boot ROM reads blocked: Bootstrap process has ended.', 0);
            parentObj.inBootstrap = false;
            parentObj.disableBootROM();
            parentObj.memory[65360] = data;
        });
        if (this.cGBC) {
            this.memoryHighWriter[108] = this.memoryWriter[65388] = _wrap_(function (parentObj, address, data) {
                if (parentObj.inBootstrap) {
                    parentObj.cGBC = (data & 1) == 0;
                    if (parentObj.name + parentObj.gameCode + parentObj.ROM[323] == 'Game and Watch 50') {
                        parentObj.cGBC = true;
                        cout('Created a boot exception for Game and Watch Gallery 2 (GBC ID byte is wrong on the cartridge).', 1);
                    }
                    cout('Booted to GBC Mode: ' + parentObj.cGBC, 0);
                }
                parentObj.memory[65388] = data;
            });
        }
    } else {
        this.memoryHighWriter[80] = this.memoryWriter[65360] = this.cartIgnoreWrite;
    }
});
GameBoyCore.prototype.toTypedArray = _wrap_(function (baseArray, memtype) {
    try {
        if (settings[5] || memtype != 'float32' && GameBoyWindow.opera && this.checkForOperaMathBug()) {
            return baseArray;
        }
        if (!baseArray || !baseArray.length) {
            return [];
        }
        var length = baseArray.length;
        switch (memtype) {
        case 'uint8':
            var typedArrayTemp = new Uint8Array(length);
            break;
        case 'int8':
            var typedArrayTemp = new Int8Array(length);
            break;
        case 'int32':
            var typedArrayTemp = new Int32Array(length);
            break;
        case 'float32':
            var typedArrayTemp = new Float32Array(length);
        }
        for (var index = 0; index < length; index++) {
            typedArrayTemp[index] = baseArray[index];
        }
        return typedArrayTemp;
    } catch (error) {
        cout('Could not convert an array to a typed array: ' + error.message, 1);
        return baseArray;
    }
});
GameBoyCore.prototype.fromTypedArray = _wrap_(function (baseArray) {
    try {
        if (!baseArray || !baseArray.length) {
            return [];
        }
        var arrayTemp = [];
        for (var index = 0; index < baseArray.length; ++index) {
            arrayTemp[index] = baseArray[index];
        }
        return arrayTemp;
    } catch (error) {
        cout('Conversion from a typed array failed: ' + error.message, 1);
        return baseArray;
    }
});
GameBoyCore.prototype.getTypedArray = _wrap_(function (length, defaultValue, numberType) {
    try {
        if (settings[5]) {
            throw new Error('');
        }
        if (numberType != 'float32' && GameBoyWindow.opera && this.checkForOperaMathBug()) {
            throw new Error('');
        }
        switch (numberType) {
        case 'int8':
            var arrayHandle = new Int8Array(length);
            break;
        case 'uint8':
            var arrayHandle = new Uint8Array(length);
            break;
        case 'int32':
            var arrayHandle = new Int32Array(length);
            break;
        case 'float32':
            var arrayHandle = new Float32Array(length);
        }
        if (defaultValue != 0) {
            var index = 0;
            while (index < length) {
                arrayHandle[index++] = defaultValue;
            }
        }
    } catch (error) {
        cout('Could not convert an array to a typed array: ' + error.message, 1);
        var arrayHandle = [];
        var index = 0;
        while (index < length) {
            arrayHandle[index++] = defaultValue;
        }
    }
    return arrayHandle;
});
GameBoyCore.prototype.checkForOperaMathBug = _wrap_(function () {
    var testTypedArray = new Uint8Array(1);
    testTypedArray[0] = -1;
    testTypedArray[0] >>= 0;
    if (testTypedArray[0] != 255) {
        cout('Detected faulty math by your browser.', 2);
        return true;
    } else {
        return false;
    }
});
'use strict';
var gameboy = null;
var gbRunInterval = null;
var settings = [
        true,
        false,
        false,
        [
            39,
            37,
            38,
            40,
            88,
            90,
            16,
            13
        ],
        true,
        false,
        4,
        15,
        30,
        false,
        false,
        false,
        false,
        16,
        1
    ];
function start(canvas, ROM) {
    clearLastEmulation();
    autoSave();
    gameboy = new GameBoyCore(canvas, ROM);
    gameboy.openMBC = openSRAM;
    gameboy.openRTC = openRTC;
    gameboy.start();
    run();
}
function run() {
    if (GameBoyEmulatorInitialized()) {
        if (!GameBoyEmulatorPlaying()) {
            gameboy.stopEmulator &= 1;
            cout('Starting the iterator.', 0);
            var dateObj = new_Date();
            gameboy.firstIteration = dateObj.getTime();
            gameboy.iterations = 0;
        } else {
            cout('The GameBoy core is already running.', 1);
        }
    } else {
        cout('GameBoy core cannot run while it has not been initialized.', 1);
    }
}
function pause() {
    if (GameBoyEmulatorInitialized()) {
        if (GameBoyEmulatorPlaying()) {
            clearLastEmulation();
        } else {
            cout('GameBoy core has already been paused.', 1);
        }
    } else {
        cout('GameBoy core cannot be paused while it has not been initialized.', 1);
    }
}
function clearLastEmulation() {
    if (GameBoyEmulatorInitialized() && GameBoyEmulatorPlaying()) {
        clearInterval(gbRunInterval);
        gameboy.stopEmulator |= 2;
        cout('The previous emulation has been cleared.', 0);
    } else {
        cout('No previous emulation was found to be cleared.', 0);
    }
}
function save() {
    if (GameBoyEmulatorInitialized()) {
        try {
            var state_suffix = 0;
            while (findValue('FREEZE_' + gameboy.name + '_' + state_suffix) != null) {
                state_suffix++;
            }
            setValue('FREEZE_' + gameboy.name + '_' + state_suffix, gameboy.saveState());
            cout('Saved the current state as: FREEZE_' + gameboy.name + '_' + state_suffix, 0);
        } catch (error) {
            cout('Could not save the current emulation state("' + error.message + '").', 2);
        }
    } else {
        cout('GameBoy core cannot be saved while it has not been initialized.', 1);
    }
}
function saveSRAM() {
    if (GameBoyEmulatorInitialized()) {
        if (gameboy.cBATT) {
            try {
                var sram = gameboy.saveSRAMState();
                if (sram.length > 0) {
                    cout('Saving the SRAM...', 0);
                    if (findValue('SRAM_' + gameboy.name) != null) {
                        cout('Deleting the old SRAM save due to outdated format.', 0);
                        deleteValue('SRAM_' + gameboy.name);
                    }
                    setValue('B64_SRAM_' + gameboy.name, arrayToBase64(sram));
                } else {
                    cout('SRAM could not be saved because it was empty.', 1);
                }
            } catch (error) {
                cout('Could not save the current emulation state("' + error.message + '").', 2);
            }
        } else {
            cout('Cannot save a game that does not have battery backed SRAM specified.', 1);
        }
        saveRTC();
    } else {
        cout('GameBoy core cannot be saved while it has not been initialized.', 1);
    }
}
function saveRTC() {
    if (GameBoyEmulatorInitialized()) {
        if (gameboy.cTIMER) {
            try {
                cout('Saving the RTC...', 0);
                setValue('RTC_' + gameboy.name, gameboy.saveRTCState());
            } catch (error) {
                cout('Could not save the RTC of the current emulation state("' + error.message + '").', 2);
            }
        }
    } else {
        cout('GameBoy core cannot be saved while it has not been initialized.', 1);
    }
}
function autoSave() {
    if (GameBoyEmulatorInitialized()) {
        cout('Automatically saving the SRAM.', 0);
        saveSRAM();
        saveRTC();
    }
}
function openSRAM(filename) {
    try {
        if (findValue('B64_SRAM_' + filename) != null) {
            cout('Found a previous SRAM state (Will attempt to load).', 0);
            return base64ToArray(findValue('B64_SRAM_' + filename));
        } else if (findValue('SRAM_' + filename) != null) {
            cout('Found a previous SRAM state (Will attempt to load).', 0);
            return findValue('SRAM_' + filename);
        } else {
            cout('Could not find any previous SRAM copy for the current ROM.', 0);
        }
    } catch (error) {
        cout('Could not open the  SRAM of the saved emulation state.', 2);
    }
    return [];
}
function openRTC(filename) {
    try {
        if (findValue('RTC_' + filename) != null) {
            cout('Found a previous RTC state (Will attempt to load).', 0);
            return findValue('RTC_' + filename);
        } else {
            cout('Could not find any previous RTC copy for the current ROM.', 0);
        }
    } catch (error) {
        cout('Could not open the RTC data of the saved emulation state.', 2);
    }
    return [];
}
function openState(filename, canvas) {
    try {
        if (findValue(filename) != null) {
            try {
                clearLastEmulation();
                cout('Attempting to run a saved emulation state.', 0);
                gameboy = new GameBoyCore(canvas, '');
                gameboy.savedStateFileName = filename;
                gameboy.returnFromState(findValue(filename));
                run();
            } catch (error) {
                alert(error.message + ' file: ' + error.fileName + ' line: ' + error.lineNumber);
            }
        } else {
            cout('Could not find the save state ' + filename + '".', 2);
        }
    } catch (error) {
        cout('Could not open the saved emulation state.', 2);
    }
}
function import_save(blobData) {
    blobData = decodeBlob(blobData);
    if (blobData && blobData.blobs) {
        if (blobData.blobs.length > 0) {
            for (var index = 0; index < blobData.blobs.length; ++index) {
                cout('Importing blob "' + blobData.blobs[index].blobID + '"', 0);
                if (blobData.blobs[index].blobContent) {
                    if (blobData.blobs[index].blobID.substring(0, 5) == 'SRAM_') {
                        setValue('B64_' + blobData.blobs[index].blobID, base64(blobData.blobs[index].blobContent));
                    } else {
                        setValue(blobData.blobs[index].blobID, JSON.parse(blobData.blobs[index].blobContent));
                    }
                } else if (blobData.blobs[index].blobID) {
                    cout('Save file imported had blob "' + blobData.blobs[index].blobID + '" with no blob data interpretable.', 2);
                } else {
                    cout('Blob chunk information missing completely.', 2);
                }
            }
        } else {
            cout('Could not decode the imported file.', 2);
        }
    } else {
        cout('Could not decode the imported file.', 2);
    }
}
function generateBlob(keyName, encodedData) {
    var saveString = 'EMULATOR_DATA';
    var consoleID = 'GameBoy';
    var totalLength = saveString.length + 4 + (1 + consoleID.length) + (1 + keyName.length + (4 + encodedData.length));
    saveString += to_little_endian_dword(totalLength);
    saveString += to_byte(consoleID.length);
    saveString += consoleID;
    saveString += to_byte(keyName.length);
    saveString += keyName;
    saveString += to_little_endian_dword(encodedData.length);
    saveString += encodedData;
    return saveString;
}
function generateMultiBlob(blobPairs) {
    var consoleID = 'GameBoy';
    var totalLength = 13 + 4 + 1 + consoleID.length;
    var saveString = to_byte(consoleID.length);
    saveString += consoleID;
    var keyName = '';
    var encodedData = '';
    for (var index = 0; index < blobPairs.length; ++index) {
        keyName = blobPairs[index][0];
        encodedData = blobPairs[index][1];
        saveString += to_byte(keyName.length);
        saveString += keyName;
        saveString += to_little_endian_dword(encodedData.length);
        saveString += encodedData;
        totalLength += 1 + keyName.length + 4 + encodedData.length;
    }
    saveString = 'EMULATOR_DATA' + to_little_endian_dword(totalLength) + saveString;
    return saveString;
}
function decodeBlob(blobData) {
    var length = blobData.length;
    var blobProperties = {};
    blobProperties.consoleID = null;
    var blobsCount = -1;
    blobProperties.blobs = [];
    if (length > 17) {
        if (blobData.substring(0, 13) == 'EMULATOR_DATA') {
            var length = Math.min((blobData.charCodeAt(16) & 255) << 24 | (blobData.charCodeAt(15) & 255) << 16 | (blobData.charCodeAt(14) & 255) << 8 | blobData.charCodeAt(13) & 255, length);
            var consoleIDLength = blobData.charCodeAt(17) & 255;
            if (length > 17 + consoleIDLength) {
                blobProperties.consoleID = blobData.substring(18, 18 + consoleIDLength);
                var blobIDLength = 0;
                var blobLength = 0;
                for (var index = 18 + consoleIDLength; index < length;) {
                    blobIDLength = blobData.charCodeAt(index++) & 255;
                    if (index + blobIDLength < length) {
                        blobProperties.blobs[++blobsCount] = {};
                        blobProperties.blobs[blobsCount].blobID = blobData.substring(index, index + blobIDLength);
                        index += blobIDLength;
                        if (index + 4 < length) {
                            blobLength = (blobData.charCodeAt(index + 3) & 255) << 24 | (blobData.charCodeAt(index + 2) & 255) << 16 | (blobData.charCodeAt(index + 1) & 255) << 8 | blobData.charCodeAt(index) & 255;
                            index += 4;
                            if (index + blobLength <= length) {
                                blobProperties.blobs[blobsCount].blobContent = blobData.substring(index, index + blobLength);
                                index += blobLength;
                            } else {
                                cout('Blob length check failed, blob determined to be incomplete.', 2);
                                break;
                            }
                        } else {
                            cout('Blob was incomplete, bailing out.', 2);
                            break;
                        }
                    } else {
                        cout('Blob was incomplete, bailing out.', 2);
                        break;
                    }
                }
            }
        }
    }
    return blobProperties;
}
function matchKey(key) {
    for (var index = 0; index < settings[3].length; index++) {
        if (settings[3][index] == key) {
            return index;
        }
    }
    return -1;
}
function GameBoyEmulatorInitialized() {
    return typeof gameboy == 'object' && gameboy != null;
}
function GameBoyEmulatorPlaying() {
    return (gameboy.stopEmulator & 2) == 0;
}
function GameBoyKeyDown(e) {
    if (GameBoyEmulatorInitialized() && GameBoyEmulatorPlaying()) {
        var keycode = matchKey(e.keyCode);
        if (keycode >= 0 && keycode < 8) {
            gameboy.JoyPadEvent(keycode, true);
            try {
                e.preventDefault();
            } catch (error) {
            }
        }
    }
}
function GameBoyKeyUp(e) {
    if (GameBoyEmulatorInitialized() && GameBoyEmulatorPlaying()) {
        var keycode = matchKey(e.keyCode);
        if (keycode >= 0 && keycode < 8) {
            gameboy.JoyPadEvent(keycode, false);
            try {
                e.preventDefault();
            } catch (error) {
            }
        }
    }
}
function GameBoyGyroSignalHandler(e) {
    if (GameBoyEmulatorInitialized() && GameBoyEmulatorPlaying()) {
        if (e.gamma || e.beta) {
            gameboy.GyroEvent(e.gamma * Math.PI / 180, e.beta * Math.PI / 180);
        } else {
            gameboy.GyroEvent(e.x, e.y);
        }
        try {
            e.preventDefault();
        } catch (error) {
        }
    }
}
function initNewCanvas() {
    if (GameBoyEmulatorInitialized()) {
        gameboy.canvas.width = gameboy.canvas.clientWidth;
        gameboy.canvas.height = gameboy.canvas.clientHeight;
    }
}
function initNewCanvasSize() {
    if (GameBoyEmulatorInitialized()) {
        if (!settings[12]) {
            if (gameboy.onscreenWidth != 160 || gameboy.onscreenHeight != 144) {
                gameboy.initLCD();
            }
        } else {
            if (gameboy.onscreenWidth != gameboy.canvas.clientWidth || gameboy.onscreenHeight != gameboy.canvas.clientHeight) {
                gameboy.initLCD();
            }
        }
    }
}
var gameboy_rom = 'r+BPyZiEZwA+AeBPySAobeEq6gAgKlYj5WJv6SRmZjjhKuXqACDJ/////////////////////////////////xgHZwCYhGcA2fX6/3/1xdXlIRPKNgHN9f/h0cHx6gAg+hLKtyAC8cnwgLcoF/CC7hjgUT6Q4FOv4FLgVOCAPv/gVfHZ8IG3IALx2fBA7gjgQA8PD+YB7gHgT/CC4FHuEOCCPojgU6/gUuBU4IE+/uBV4ID6NMs86jTL8dkKCgoKbWFkZSBieSBhZ28uIGVtYWlsOmdvYnV6b3ZAeWFob28uY29tCnVybDogc3BlY2N5LmRhLnJ1CgoKCv///////wDDSgnO7WZmzA0ACwNzAIMADAANAAgRH4iJAA7czG7m3d3Zmbu7Z2NuDuzM3dyZn7u5Mz5BR08nUyBSRUFMVElNRSCAAAAAAgEDADMBSTQeIUD/y37I8P/1y4fg//BE/pEg+su+8eD/yT7A4EY+KD0g/cnF1eWvEQPK1RITEhMGAyEAyuXFTgYAIWAMCQkqEhMqEhPB4SMFIOrhrwYIzYsU4dHByf////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////8AAgMFBggJCwwOEBETFBYXGBobHR4fISIjJSYnKSorLC0uLzAxMjM0NTY3ODg5Ojo7PDw9PT4+Pj8/Pz9AQEBAQEBAQEBAPz8/Pz4+PT08PDs7Ojk5ODc2NTU0MzIxMC8uLCsqKSgmJSQjISAfHRwaGRcWFRMSEA8NCwoIBwUEAgH//fz6+ff29PPx8O7t6+ro5+Xk4uHg3t3c2tnY19bU09LR0M/OzczLysnJyMfGxsXFxMPDw8LCwcHBwcDAwMDAwMDAwMDBwcHBwsLDw8PExcXGxsfIycnKy8zNzs/Q0dLT1NXX2Nna3N3e4OHi5OXn6Onr7O7v8fL09vf5+vz9AAEECRAZJDFAUWR5kKnE4QAhRGmQueQRQHGk2RBJhMEAQYTJEFmk8UCR5DmQ6UShAGHEKZD5ZNFAsSSZEIkEgQCBBIkQmSSxQNFk+ZApxGEAoUTpkDnkkUDxpFkQyYRBAMGESRDZpHFAEeS5kGlEIQDhxKmQeWRRQDEkGRAJBAEAAQQJEBkkMUBRZHmQqcThACFEaZC55BFAcaTZEEmEwQBBhMkQWaTxQJHkOZDpRKEAYcQpkPlk0UCxJJkQiQSBAIEEiRCZJLFA0WT5kCnEYQChROmQOeSRQPGkWRDJhEEAwYRJENmkcUAR5LmQaUQhAOHEqZB5ZFFAMSQZEAkEAQAAAAAAAAAAAAAAAAAAAAABAQEBAQEBAgICAgIDAwMDBAQEBAUFBQUGBgYHBwcICAkJCQoKCgsLDAwNDQ4ODw8QEBEREhITExQUFRUWFxcYGRkaGhscHB0eHh8gISEiIyQkJSYnJygpKisrLC0uLzAxMTIzNDU2Nzg5Ojs8PT4/QEFCQ0RFRkdISUpLTE1OT1FSU1RVVldZWltcXV9gYWJkZWZnaWprbG5vcHJzdHZ3eXp7fX5/gYKEhYeIiouNjpCRk5SWl5manJ2foKKkpaepqqytr7GytLa3ubu9vsDCxMXHycvMztDS1NXX2dvd3+Hi5Obo6uzu8PL09vj6/P4A//z38Ofcz8CvnIdwVzwfAN+8l3BHHO/Aj1wn8Ld8PwC/fDfwp1wPwG8cx3AXvF8AnzzXcAecL8BP3Gfwd/x/AH/8d/Bn3E/AL5wHcNc8nwBfvBdwxxxvwA9cp/A3fL8AP3y38Cdcj8DvHEdwl7zfAB88V3CHnK/Az9zn8Pf8/wD//Pfw59zPwK+ch3BXPB8A37yXcEcc78CPXCfwt3w/AL98N/CnXA/AbxzHcBe8XwCfPNdwB5wvwE/cZ/B3/H8Af/x38GfcT8AvnAdw1zyfAF+8F3DHHG/AD1yn8Dd8vwA/fLfwJ1yPwO8cR3CXvN8AHzxXcIecr8DP3Ofw9/z/AP/////////////////////+/v7+/v79/f39/fz8/Pz8+/v7+vr6+vn5+fj4+Pf39/b29fX19PTz8/Ly8fHw8PDv7u7t7ezs6+vq6uno6Ofn5uXl5OPj4uHh4N/e3t3c3Nva2djY19bV1NTT0tHQz8/OzczLysnIx8bFxMPCwcDAvr28u7q5uLe2tbSzsrGwr62sq6qpqKalpKOioJ+enZyamZiWlZSTkZCPjYyLiYiHhYSCgYB+fXt6eHd1dHJxcG5sa2loZmVjYmBfXVtaWFdVU1JQTk1LSUhGREJBPz08Ojg2NDMxLy0rKigmJCIgHx0bGRcVExEPDQsJBwUDAf9/Px8PBwMBgEAgEAgEAgEAAQEBAQEBAQEBAQEA//////////////+AEAcAAQABAAEBAAEBAAEA/wD//wD//wD/AP+AKwcBAAEAAQD/AP8A/wD/AP8A/wABAAEAAQCARgcBAQEBAQD//////////////wABAQEBAQGAYQf///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////+AwODw+Pz+/xEAwAGxwj4E9cU+BfUKbwMKZ37+gCALI34LAiN+AwILGOsahhIDHBwcHPE9IN7BIRAAGVRdPgX1Cm8DCmcalhIjfAILfQIDAx0dHR3xPSDnIRgAGVRd8T0grskRAcAB6cI+BPUKbwMKZ37+gCALI34LAiN+AwILGOs+CvUahhIcHBwc8T0g9CN8Agt9AgMD8T0g0MkgIEZJTExFRCAgIFBPTFlHT05TIEhFTElDT1BURVJJTiBBQ1RJT04gIQDADgpwLHQsGhPWICI2ACwNIPE+oOoQyngBCQDlYmsJVF3hDMYKR3AsdCwaG9YgIjYALA0g8a/qEcrJ+hDK/jDI1gTqEMpHPqCQ/lA4Aj5QDgAM1ggw+3ghAcARBAB3xggZDSD5+hHKg+oRykf+UDgCPlAOAAzWCDD7eC4td9YIGQ0g+ckh9grzMf/PzVABr+Am4P/gD+BD4EL2SOBFPkDgQT4E4AfN9RM+CuoAAA4HeeBwJqCvIstsKPsNIPIh/v8yy30g+wEKABH1/yFpAc3kE+cCAVYAEQDBIVt2zeQTrwYYIWsOzYsUIYsOzaQUxwGwAxEAgCGhF8XlzeQT4cERAIjN5BMhAJgRAwABYMDHcc9yIwUg+BQdIPHN9RMhuxUGAc2WE82JEz5E4EGv4EU+A+D/+z4B6hLK4E0QAAB4zccTBSD6zZATxwEACFkhAIhzIwt4sSD5IQDHPv9FdyRwJCJ3JXclcCwg8x5/IQCYx3PPNgDL1DYIx3PLlCPLVCjuPoABDxARIAAhIpjF5XfL1HfLlDwZDSD1POEswQUg7D486jPLr+o0yz3qL8s+oOCCPgLqG8vNiRM+ROBBr+BFPgPg/68+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MAGEeRcvT/F5MAIvPIVvJrcBAAA+t7zLEbrLED6/vcsRu8sQPj+8P8sRuj/LEL0/yxG7P8sQeLHIeKHAebcgB3xiV31rX3jLH9L/HD5AlU97lW96lPUwAi88R6/LGTABgB/LGTABgB/LGTABgB/LGTABgB/LGTABgB/LGTABgB/LGTABgB/LGTABgB/LGcsRyxeVMAGFyxHLF5UwAYXLEcsXlTABhcsRyxeVMAGFyxHLF5UwAYXLEcsXlTABhcsRyxeVMAGFyxHLF5UwAYV5Fy9P8XkwAi88hGcuQMMxHMsf0pcdPkCUT3qUZ3uV9TACLzxHr8sZMAGAH8sZMAGAH8sZMAGAH8sZMAGAH8sZMAGAH8sZMAGAH8sZMAGAH8sZMAGAH8sZyxHLF5QwAYTLEcsXlDABhMsRyxeUMAGEyxHLF5QwAYTLEcsXlDABhMsRyxeUMAGEyxHLF5QwAYTLEcsXlDABhHkXL0/xeTACLzyFbyZAwzEcyx/SoRt91r9PfZNvepT1MAIvPEevyxkwAYAfyxkwAYAfyxkwAYAfyxkwAYAfyxkwAYAfyxkwAYAfyxkwAYAfyxkwAYAfyxnLEcsXlTABhcsRyxeVMAGFyxHLF5UwAYXLEcsXlTABhcsRyxeVMAGFyxHLF5UwAYXLEcsXlTABhcsRyxeVMAGFeRcvT/F5MAIvPIRnLr/DMRz//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////3q8MAVUZ3tdb3u90pdAfZNPepRfkTA+V3nLPy88g+CDPn+R5YdPbyYARCkpKQkBkVIJweV41kAXb3nWQB8fH+YPZ/CChGd55gcGB/YITwpP8INHLMl5S1+RV3nLPy88g+CDPneR5YdPbyYARCkpKQkBklsJweV41kAXb3nWQB8fH+YPZ/CChGd55gcGB/YITwpP8INHLMmVT3qUX5EwPld5yz8vPIPggz5/keWHT28mAEQpKSkJAR9BCcHleNZAF2951kAfHx/mD2fwgoRneeYHBgf2CE8KT/CDRyzJeUtfkVd5yz8vPIPggz53keWHT28mAEQpKSkJASBKCcHleNZAF2951kAfHx/mD2fwgoRneeYHBgf2CE8KT/CDRyzJfrF3e8t4IAN6LCyAR8sJMAEkfrF3e8t4IAN6LCyAR8sJMAEkfrF3e8t4IAN6LCyAR8sJMAEkfrF3e8t4IAN6LCyAR8sJMAEkfrF3e8t4IAN6LCyAR8sJMAEkfrF3e8t4IAN6LCyAR8sJMAEkfrF3e8t4IAN6LCyAR8sJMAEkfrF3e8t4IAN6LCyAR8sJMAEkfrF3e8t4IAN6LCyAR8sJMAEkfrF3e8t4IAN6LCyAR8sJMAEkfrF3e8t4IAN6LCyAR8sJMAEkfrF3e8t4IAN6LCyAR8sJMAEkfrF3e8t4IAN6LCyAR8sJMAEkfrF3e8t4IAN6LCyAR8sJMAEkfrF3e8t4IAN6LCyAR8sJMAEkfrF3e8t4IAN6LCyAR8sJMAEkfrF3e8t4IAN6LCyAR8sJMAEkfrF3e8t4IAN6LCyAR8sJMAEkfrF3e8t4IAN6LCyAR8sJMAEkfrF3e8t4IAN6LCyAR8sJMAEkfrF3e8t4IAN6LCyAR8sJMAEkfrF3e8t4IAN6LCyAR8sJMAEkfrF3e8t4IAN6LCyAR8sJMAEkfrF3e8t4IAN6LCyAR8sJMAEkfrF3e8t4IAN6LCyAR8sJMAEkfrF3e8t4IAN6LCyAR8sJMAEkfrF3e8t4IAN6LCyAR8sJMAEkfrF3e8t4IAN6LCyAR8sJMAEkfrF3e8t4IAN6LCyAR8sJMAEkfrF3e8t4IAN6LCyAR8sJMAEkfrF3e8t4IAN6LCyAR8sJMAEkfrF3e8t4IAN6LCyAR8sJMAEkfrF3e8t4IAN6LCyAR8sJMAEkfrF3e8t4IAN6LCyAR8sJMAEkfrF3e8t4IAN6LCyAR8sJMAEkfrF3e8t4IAN6LCyAR8sJMAEkfrF3e8t4IAN6LCyAR8sJMAEkfrF3e8t4IAN6LCyAR8sJMAEkfrF3e8t4IAN6LCyAR8sJMAEkfrF3e8t4IAN6LCyAR8sJMAEkfrF3e8t4IAN6LCyAR8sJMAEkfrF3e8t4IAN6LCyAR8sJMAEkfrF3e8t4IAN6LCyAR8sJMAEkfrF3e8t4IAN6LCyAR8sJMAEkfrF3e8t4IAN6LCyAR8sJMAEkfrF3e8t4IAN6LCyAR8sJMAEkfrF3e8t4IAN6LCyAR8sJMAEkfrF3e8t4IAN6LCyAR8sJMAEkfrF3e8t4IAN6LCyAR8sJMAEkfrF3e8t4IAN6LCyAR8sJMAEkfrF3e8t4IAN6LCyAR8sJMAEkfrF3e8t4IAN6LCyAR8sJMAEkfrF3e8t4IAN6LCyAR8sJMAEkfrF3e8t4IAN6LCyAR8sJMAEkfrF3e8t4IAN6LCyAR8sJMAEkfrF3e8t4IAN6LCyAR8sJMAEkfrF3e8t4IAN6LCyAR8sJMAEkfrF3e8t4IAN6LCyAR8sJMAEkfrF3e8t4IAN6LCyAR8sJMAEkfrF3e8t4IAN6LCyAR8sJMAEkfrF3e8t4IAN6LCyAR8sJMAEkfrF3e8t4IAN6LCyAR8sJMAEkfrF3e8t4IAN6LCyAR8sJMAEkfrF3e8t4IAN6LCyAR8sJMAEkfrF3e8t4IAN6LCyAR8sJMAEkfrF3e8t4IAN6LCyAR8sJMAEkfrF3e8t4IAN6LCyAR8sJMAEkfrF3e8t4IAN6LCyAR8sJMAEkfrF3e8t4IAN6LCyAR8sJMAEkfrF3e8t4IAN6LCyAR8sJMAEkfrF3e8t4IAN6LCyAR8sJMAEkfrF3e8t4IAN6LCyAR8sJMAEkfrF3e8t4IAN6LCyAR8sJMAEkfrF3e8t4IAN6LCyAR8sJMAEkfrF3e8t4IAN6LCyAR8sJMAEkfrF3e8t4IAN6LCyAR8sJMAEkfrF3e8t4IAN6LCyAR8sJMAEkfrF3e8t4IAN6LCyAR8sJMAEkfrF3e8t4IAN6LCyAR8sJMAEkfrF3e8t4IAN6LCyAR8sJMAEkfrF3e8t4IAN6LCyAR8sJMAEkfrF3e8t4IAN6LCyAR8sJMAEkfrF3e8t4IAN6LCyAR8sJMAEkfrF3e8t4IAN6LCyAR8sJMAEkfrF3e8t4IAN6LCyAR8sJMAEkfrF3e8t4IAN6LCyAR8sJMAEkfrF3e8t4IAN6LCyAR8sJMAEkfrF3e8t4IAN6LCyAR8sJMAEkfrF3e8t4IAN6LCyAR8sJMAEkfrF3e8t4IAN6LCyAR8sJMAEkfrF3e8t4IAN6LCyAR8sJMAEkfrF3e8t4IAN6LCyAR8sJMAEkfrF3e8t4IAN6LCyAR8sJMAEkfrF3e8t4IAN6LCyAR8sJMAEkfrF3e8t4IAN6LCyAR8sJMAEkfrF3e8t4IAN6LCyAR8sJMAEkfrF3e8t4IAN6LCyAR8sJMAEkfrF3e8t4IAN6LCyAR8sJMAEkfrF3e8t4IAN6LCyAR8sJMAEkfrF3e8t4IAN6LCyAR8sJMAEkfrF3e8t4IAN6LCyAR8sJMAEkfrF3e8t4IAN6LCyAR8sJMAEkfrF3e8t4IAN6LCyAR8sJMAEkfrF3e8t4IAN6LCyAR8sJMAEkfrF3e8t4IAN6LCyAR8sJMAEkfrF3e8t4IAN6LCyAR8sJMAEkfrF3e8t4IAN6LCyAR8sJMAEkfrF3e8t4IAN6LCyAR8sJMAEkfrF3e8t4IAN6LCyAR8sJMAEkfrF3e8t4IAN6LCyAR8sJMAEkfrF3e8t4IAN6LCyAR8sJMAEkfrF3e8t4IAN6LCyAR8sJMAEkfrF3e8t4IAN6LCyAR8sJMAEkfrF3e8t4IAN6LCyAR8sJMAEkfrF3e8t4IAN6LCyAR8sJMAEkfrF3e8t4IAN6LCyAR8sJMAEkfrF3e8t4IAN6LCyAR8sJMAEkfrF3e8t4IAN6LCyAR8sJMAEkfrF3e8t4IAN6LCyAR8sJMAEkfrF3e8t4IAN6LCyAR8sJMAEkfrF3e8t4IAN6LCyAR8sJMAEkfrF3e8t4IAN6LCyAR8sJMAEkfrF3e8t4IAN6LCyAR8sJMAEkfrF3e8t4IAN6LCyAR8sJMAEkfrF3e8t4IAN6LCyAR8sJMAEkfrF3e8t4IAN6LCyAR8sJMAEkfrF3e8t4IAN6LCyAR8sJMAEkfrF3e8t4IAN6LCyAR8sJMAEkyX6xInvLeCAGessJMAEkgEcALH6xInvLeCAGessJMAEkgEcALH6xInvLeCAGessJMAEkgEcALH6xInvLeCAGessJMAEkgEcALH6xInvLeCAGessJMAEkgEcALH6xInvLeCAGessJMAEkgEcALH6xInvLeCAGessJMAEkgEcALH6xInvLeCAGessJMAEkgEcALH6xInvLeCAGessJMAEkgEcALH6xInvLeCAGessJMAEkgEcALH6xInvLeCAGessJMAEkgEcALH6xInvLeCAGessJMAEkgEcALH6xInvLeCAGessJMAEkgEcALH6xInvLeCAGessJMAEkgEcALH6xInvLeCAGessJMAEkgEcALH6xInvLeCAGessJMAEkgEcALH6xInvLeCAGessJMAEkgEcALH6xInvLeCAGessJMAEkgEcALH6xInvLeCAGessJMAEkgEcALH6xInvLeCAGessJMAEkgEcALH6xInvLeCAGessJMAEkgEcALH6xInvLeCAGessJMAEkgEcALH6xInvLeCAGessJMAEkgEcALH6xInvLeCAGessJMAEkgEcALH6xInvLeCAGessJMAEkgEcALH6xInvLeCAGessJMAEkgEcALH6xInvLeCAGessJMAEkgEcALH6xInvLeCAGessJMAEkgEcALH6xInvLeCAGessJMAEkgEcALH6xInvLeCAGessJMAEkgEcALH6xInvLeCAGessJMAEkgEcALH6xInvLeCAGessJMAEkgEcALH6xInvLeCAGessJMAEkgEcALH6xInvLeCAGessJMAEkgEcALH6xInvLeCAGessJMAEkgEcALH6xInvLeCAGessJMAEkgEcALH6xInvLeCAGessJMAEkgEcALH6xInvLeCAGessJMAEkgEcALH6xInvLeCAGessJMAEkgEcALH6xInvLeCAGessJMAEkgEcALH6xInvLeCAGessJMAEkgEcALH6xInvLeCAGessJMAEkgEcALH6xInvLeCAGessJMAEkgEcALH6xInvLeCAGessJMAEkgEcALH6xInvLeCAGessJMAEkgEcALH6xInvLeCAGessJMAEkgEcALH6xInvLeCAGessJMAEkgEcALH6xInvLeCAGessJMAEkgEcALH6xInvLeCAGessJMAEkgEcALH6xInvLeCAGessJMAEkgEcALH6xInvLeCAGessJMAEkgEcALH6xInvLeCAGessJMAEkgEcALH6xInvLeCAGessJMAEkgEcALH6xInvLeCAGessJMAEkgEcALH6xInvLeCAGessJMAEkgEcALH6xInvLeCAGessJMAEkgEcALH6xInvLeCAGessJMAEkgEcALH6xInvLeCAGessJMAEkgEcALH6xInvLeCAGessJMAEkgEcALH6xInvLeCAGessJMAEkgEcALH6xInvLeCAGessJMAEkgEcALH6xInvLeCAGessJMAEkgEcALH6xInvLeCAGessJMAEkgEcALH6xInvLeCAGessJMAEkgEcALH6xInvLeCAGessJMAEkgEcALH6xInvLeCAGessJMAEkgEcALH6xInvLeCAGessJMAEkgEcALH6xInvLeCAGessJMAEkgEcALH6xInvLeCAGessJMAEkgEcALH6xInvLeCAGessJMAEkgEcALH6xInvLeCAGessJMAEkgEcALH6xInvLeCAGessJMAEkgEcALH6xInvLeCAGessJMAEkgEcALH6xInvLeCAGessJMAEkgEcALH6xInvLeCAGessJMAEkgEcALH6xInvLeCAGessJMAEkgEcALH6xInvLeCAGessJMAEkgEcALH6xInvLeCAGessJMAEkgEcALH6xInvLeCAGessJMAEkgEcALH6xInvLeCAGessJMAEkgEcALH6xInvLeCAGessJMAEkgEcALH6xInvLeCAGessJMAEkgEcALH6xInvLeCAGessJMAEkgEcALH6xInvLeCAGessJMAEkgEcALH6xInvLeCAGessJMAEkgEcALH6xInvLeCAGessJMAEkgEcALH6xInvLeCAGessJMAEkgEcALH6xInvLeCAGessJMAEkgEcALH6xInvLeCAGessJMAEkgEcALH6xInvLeCAGessJMAEkgEcALH6xInvLeCAGessJMAEkgEcALH6xInvLeCAGessJMAEkgEcALH6xInvLeCAGessJMAEkgEcALH6xInvLeCAGessJMAEkgEcALH6xInvLeCAGessJMAEkgEcALH6xInvLeCAGessJMAEkgEcALH6xInvLeCAGessJMAEkgEcALH6xInvLeCAGessJMAEkgEcALH6xInvLeCAGessJMAEkgEcALH6xInvLeCAGessJMAEkgEcALH6xInvLeCAGessJMAEkgEcALH6xInvLeCAGessJMAEkgEcALH6xInvLeCAGessJMAEkgEcALH6xInvLeCAGessJMAEkgEcALH6xInvLeCAGessJMAEkgEcALH6xInvLeCAGessJMAEkgEcALH6xInvLeCAGessJMAEkgEcALH6xInvLeCAGessJMAEkgEcALH6xInvLeCAGessJMAEkgEcALH6xInvLeCAGessJMAEkgEcALH6xInvLeCAGessJMAEkgEcALH6xInvLeCAGessJMAEkgEcALH6xInvLeCAGessJMAEkgEcALH6xInvLeCAGessJMAEkgEcALH6xInvLeCAGessJMAEkgEcALH6xInvLeCAGessJMAEkgEcALH6xInvLeCAGessJMAEkgEcALH6xInvLeCAGessJMAEkgEcALH6xInvLeCAGessJMAEkgEcALH6xInvLeCAGessJMAEkgEcALMl+sXd7y3ggA3osLIBHywEwASV+sXd7y3ggA3osLIBHywEwASV+sXd7y3ggA3osLIBHywEwASV+sXd7y3ggA3osLIBHywEwASV+sXd7y3ggA3osLIBHywEwASV+sXd7y3ggA3osLIBHywEwASV+sXd7y3ggA3osLIBHywEwASV+sXd7y3ggA3osLIBHywEwASV+sXd7y3ggA3osLIBHywEwASV+sXd7y3ggA3osLIBHywEwASV+sXd7y3ggA3osLIBHywEwASV+sXd7y3ggA3osLIBHywEwASV+sXd7y3ggA3osLIBHywEwASV+sXd7y3ggA3osLIBHywEwASV+sXd7y3ggA3osLIBHywEwASV+sXd7y3ggA3osLIBHywEwASV+sXd7y3ggA3osLIBHywEwASV+sXd7y3ggA3osLIBHywEwASV+sXd7y3ggA3osLIBHywEwASV+sXd7y3ggA3osLIBHywEwASV+sXd7y3ggA3osLIBHywEwASV+sXd7y3ggA3osLIBHywEwASV+sXd7y3ggA3osLIBHywEwASV+sXd7y3ggA3osLIBHywEwASV+sXd7y3ggA3osLIBHywEwASV+sXd7y3ggA3osLIBHywEwASV+sXd7y3ggA3osLIBHywEwASV+sXd7y3ggA3osLIBHywEwASV+sXd7y3ggA3osLIBHywEwASV+sXd7y3ggA3osLIBHywEwASV+sXd7y3ggA3osLIBHywEwASV+sXd7y3ggA3osLIBHywEwASV+sXd7y3ggA3osLIBHywEwASV+sXd7y3ggA3osLIBHywEwASV+sXd7y3ggA3osLIBHywEwASV+sXd7y3ggA3osLIBHywEwASV+sXd7y3ggA3osLIBHywEwASV+sXd7y3ggA3osLIBHywEwASV+sXd7y3ggA3osLIBHywEwASV+sXd7y3ggA3osLIBHywEwASV+sXd7y3ggA3osLIBHywEwASV+sXd7y3ggA3osLIBHywEwASV+sXd7y3ggA3osLIBHywEwASV+sXd7y3ggA3osLIBHywEwASV+sXd7y3ggA3osLIBHywEwASV+sXd7y3ggA3osLIBHywEwASV+sXd7y3ggA3osLIBHywEwASV+sXd7y3ggA3osLIBHywEwASV+sXd7y3ggA3osLIBHywEwASV+sXd7y3ggA3osLIBHywEwASV+sXd7y3ggA3osLIBHywEwASV+sXd7y3ggA3osLIBHywEwASV+sXd7y3ggA3osLIBHywEwASV+sXd7y3ggA3osLIBHywEwASV+sXd7y3ggA3osLIBHywEwASV+sXd7y3ggA3osLIBHywEwASV+sXd7y3ggA3osLIBHywEwASV+sXd7y3ggA3osLIBHywEwASV+sXd7y3ggA3osLIBHywEwASV+sXd7y3ggA3osLIBHywEwASV+sXd7y3ggA3osLIBHywEwASV+sXd7y3ggA3osLIBHywEwASV+sXd7y3ggA3osLIBHywEwASV+sXd7y3ggA3osLIBHywEwASV+sXd7y3ggA3osLIBHywEwASV+sXd7y3ggA3osLIBHywEwASV+sXd7y3ggA3osLIBHywEwASV+sXd7y3ggA3osLIBHywEwASV+sXd7y3ggA3osLIBHywEwASV+sXd7y3ggA3osLIBHywEwASV+sXd7y3ggA3osLIBHywEwASV+sXd7y3ggA3osLIBHywEwASV+sXd7y3ggA3osLIBHywEwASV+sXd7y3ggA3osLIBHywEwASV+sXd7y3ggA3osLIBHywEwASV+sXd7y3ggA3osLIBHywEwASV+sXd7y3ggA3osLIBHywEwASV+sXd7y3ggA3osLIBHywEwASV+sXd7y3ggA3osLIBHywEwASV+sXd7y3ggA3osLIBHywEwASV+sXd7y3ggA3osLIBHywEwASV+sXd7y3ggA3osLIBHywEwASV+sXd7y3ggA3osLIBHywEwASV+sXd7y3ggA3osLIBHywEwASV+sXd7y3ggA3osLIBHywEwASV+sXd7y3ggA3osLIBHywEwASV+sXd7y3ggA3osLIBHywEwASV+sXd7y3ggA3osLIBHywEwASV+sXd7y3ggA3osLIBHywEwASV+sXd7y3ggA3osLIBHywEwASV+sXd7y3ggA3osLIBHywEwASV+sXd7y3ggA3osLIBHywEwASV+sXd7y3ggA3osLIBHywEwASV+sXd7y3ggA3osLIBHywEwASV+sXd7y3ggA3osLIBHywEwASV+sXd7y3ggA3osLIBHywEwASV+sXd7y3ggA3osLIBHywEwASV+sXd7y3ggA3osLIBHywEwASV+sXd7y3ggA3osLIBHywEwASV+sXd7y3ggA3osLIBHywEwASV+sXd7y3ggA3osLIBHywEwASV+sXd7y3ggA3osLIBHywEwASV+sXd7y3ggA3osLIBHywEwASV+sXd7y3ggA3osLIBHywEwASV+sXd7y3ggA3osLIBHywEwASV+sXd7y3ggA3osLIBHywEwASV+sXd7y3ggA3osLIBHywEwASV+sXd7y3ggA3osLIBHywEwASV+sXd7y3ggA3osLIBHywEwASV+sXd7y3ggA3osLIBHywEwASV+sXd7y3ggA3osLIBHywEwASV+sXd7y3ggA3osLIBHywEwASV+sXd7y3ggA3osLIBHywEwASV+sXd7y3ggA3osLIBHywEwASV+sXd7y3ggA3osLIBHywEwASV+sXd7y3ggA3osLIBHywEwASV+sXd7y3ggA3osLIBHywEwASV+sXd7y3ggA3osLIBHywEwASV+sXd7y3ggA3osLIBHywEwASV+sXd7y3ggA3osLIBHywEwASV+sXd7y3ggA3osLIBHywEwASV+sXd7y3ggA3osLIBHywEwASV+sXd7y3ggA3osLIBHywEwASV+sXd7y3ggA3osLIBHywEwASV+sXd7y3ggA3osLIBHywEwASV+sXd7y3ggA3osLIBHywEwASV+sXd7y3ggA3osLIBHywEwASV+sXd7y3ggA3osLIBHywEwASXJfrF3e8t4IAZ6ywEwASWARywsfrF3e8t4IAZ6ywEwASWARywsfrF3e8t4IAZ6ywEwASWARywsfrF3e8t4IAZ6ywEwASWARywsfrF3e8t4IAZ6ywEwASWARywsfrF3e8t4IAZ6ywEwASWARywsfrF3e8t4IAZ6ywEwASWARywsfrF3e8t4IAZ6ywEwASWARywsfrF3e8t4IAZ6ywEwASWARywsfrF3e8t4IAZ6ywEwASWARywsfrF3e8t4IAZ6ywEwASWARywsfrF3e8t4IAZ6ywEwASWARywsfrF3e8t4IAZ6ywEwASWARywsfrF3e8t4IAZ6ywEwASWARywsfrF3e8t4IAZ6ywEwASWARywsfrF3e8t4IAZ6ywEwASWARywsfrF3e8t4IAZ6ywEwASWARywsfrF3e8t4IAZ6ywEwASWARywsfrF3e8t4IAZ6ywEwASWARywsfrF3e8t4IAZ6ywEwASWARywsfrF3e8t4IAZ6ywEwASWARywsfrF3e8t4IAZ6ywEwASWARywsfrF3e8t4IAZ6ywEwASWARywsfrF3e8t4IAZ6ywEwASWARywsfrF3e8t4IAZ6ywEwASWARywsfrF3e8t4IAZ6ywEwASWARywsfrF3e8t4IAZ6ywEwASWARywsfrF3e8t4IAZ6ywEwASWARywsfrF3e8t4IAZ6ywEwASWARywsfrF3e8t4IAZ6ywEwASWARywsfrF3e8t4IAZ6ywEwASWARywsfrF3e8t4IAZ6ywEwASWARywsfrF3e8t4IAZ6ywEwASWARywsfrF3e8t4IAZ6ywEwASWARywsfrF3e8t4IAZ6ywEwASWARywsfrF3e8t4IAZ6ywEwASWARywsfrF3e8t4IAZ6ywEwASWARywsfrF3e8t4IAZ6ywEwASWARywsfrF3e8t4IAZ6ywEwASWARywsfrF3e8t4IAZ6ywEwASWARywsfrF3e8t4IAZ6ywEwASWARywsfrF3e8t4IAZ6ywEwASWARywsfrF3e8t4IAZ6ywEwASWARywsfrF3e8t4IAZ6ywEwASWARywsfrF3e8t4IAZ6ywEwASWARywsfrF3e8t4IAZ6ywEwASWARywsfrF3e8t4IAZ6ywEwASWARywsfrF3e8t4IAZ6ywEwASWARywsfrF3e8t4IAZ6ywEwASWARywsfrF3e8t4IAZ6ywEwASWARywsfrF3e8t4IAZ6ywEwASWARywsfrF3e8t4IAZ6ywEwASWARywsfrF3e8t4IAZ6ywEwASWARywsfrF3e8t4IAZ6ywEwASWARywsfrF3e8t4IAZ6ywEwASWARywsfrF3e8t4IAZ6ywEwASWARywsfrF3e8t4IAZ6ywEwASWARywsfrF3e8t4IAZ6ywEwASWARywsfrF3e8t4IAZ6ywEwASWARywsfrF3e8t4IAZ6ywEwASWARywsfrF3e8t4IAZ6ywEwASWARywsfrF3e8t4IAZ6ywEwASWARywsfrF3e8t4IAZ6ywEwASWARywsfrF3e8t4IAZ6ywEwASWARywsfrF3e8t4IAZ6ywEwASWARywsfrF3e8t4IAZ6ywEwASWARywsfrF3e8t4IAZ6ywEwASWARywsfrF3e8t4IAZ6ywEwASWARywsfrF3e8t4IAZ6ywEwASWARywsfrF3e8t4IAZ6ywEwASWARywsfrF3e8t4IAZ6ywEwASWARywsfrF3e8t4IAZ6ywEwASWARywsfrF3e8t4IAZ6ywEwASWARywsfrF3e8t4IAZ6ywEwASWARywsfrF3e8t4IAZ6ywEwASWARywsfrF3e8t4IAZ6ywEwASWARywsfrF3e8t4IAZ6ywEwASWARywsfrF3e8t4IAZ6ywEwASWARywsfrF3e8t4IAZ6ywEwASWARywsfrF3e8t4IAZ6ywEwASWARywsfrF3e8t4IAZ6ywEwASWARywsfrF3e8t4IAZ6ywEwASWARywsfrF3e8t4IAZ6ywEwASWARywsfrF3e8t4IAZ6ywEwASWARywsfrF3e8t4IAZ6ywEwASWARywsfrF3e8t4IAZ6ywEwASWARywsfrF3e8t4IAZ6ywEwASWARywsfrF3e8t4IAZ6ywEwASWARywsfrF3e8t4IAZ6ywEwASWARywsfrF3e8t4IAZ6ywEwASWARywsfrF3e8t4IAZ6ywEwASWARywsfrF3e8t4IAZ6ywEwASWARywsfrF3e8t4IAZ6ywEwASWARywsfrF3e8t4IAZ6ywEwASWARywsfrF3e8t4IAZ6ywEwASWARywsfrF3e8t4IAZ6ywEwASWARywsfrF3e8t4IAZ6ywEwASWARywsfrF3e8t4IAZ6ywEwASWARywsfrF3e8t4IAZ6ywEwASWARywsfrF3e8t4IAZ6ywEwASWARywsfrF3e8t4IAZ6ywEwASWARywsfrF3e8t4IAZ6ywEwASWARywsfrF3e8t4IAZ6ywEwASWARywsfrF3e8t4IAZ6ywEwASWARywsfrF3e8t4IAZ6ywEwASWARywsfrF3e8t4IAZ6ywEwASWARywsfrF3e8t4IAZ6ywEwASWARywsfrF3e8t4IAZ6ywEwASWARywsfrF3e8t4IAZ6ywEwASWARywsfrF3e8t4IAZ6ywEwASWARywsfrF3e8t4IAZ6ywEwASWARywsfrF3e8t4IAZ6ywEwASWARywsfrF3e8t4IAZ6ywEwASWARywsfrF3e8t4IAZ6ywEwASWARywsfrF3e8t4IAZ6ywEwASWARywsfrF3e8t4IAZ6ywEwASWARywsfrF3e8t4IAZ6ywEwASWARywsfrF3e8t4IAZ6ywEwASWARywsfrF3e8t4IAZ6ywEwASWARywsfrF3e8t4IAZ6ywEwASWARywsyf///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////wHRe7o4A1pXewYHoE8K9XqgTwQK4JF6Hx8f5g9X8JNnTixGLXsfHx/mD1/wgoNne5LRxADB8JGiVy+mX3qhsyJ6L6ZfeqCzItF7ujgDWld7BgegTwr1eqBPBArgkXofHx/mD1fwk2dOLEYtex8fH+YPX/CCg2d7ktHEAMHwkaJXL6ZfeqGzInovpl96oLMi0Xu6OANaV3sGB6BPCvV6oE8ECuCReh8fH+YPV/CTZ04sRi17Hx8f5g9f8IKDZ3uS0cQAwfCRolcvpl96obMiei+mX3qgsyLRe7o4A1pXewYHoE8K9XqgTwQK4JF6Hx8f5g9X8JNnTixGLXsfHx/mD1/wgoNne5LRxADB8JGiVy+mX3qhsyJ6L6ZfeqCzItF7ujgDWld7BgegTwr1eqBPBArgkXofHx/mD1fwk2dOLEYtex8fH+YPX/CCg2d7ktHEAMHwkaJXL6ZfeqGzInovpl96oLMi0Xu6OANaV3sGB6BPCvV6oE8ECuCReh8fH+YPV/CTZ04sRi17Hx8f5g9f8IKDZ3uS0cQAwfCRolcvpl96obMiei+mX3qgsyLRe7o4A1pXewYHoE8K9XqgTwQK4JF6Hx8f5g9X8JNnTixGLXsfHx/mD1/wgoNne5LRxADB8JGiVy+mX3qhsyJ6L6ZfeqCzItF7ujgDWld7BgegTwr1eqBPBArgkXofHx/mD1fwk2dOLEYtex8fH+YPX/CCg2d7ktHEAMHwkaJXL6ZfeqGzInovpl96oLMi0Xu6OANaV3sGB6BPCvV6oE8ECuCReh8fH+YPV/CTZ04sRi17Hx8f5g9f8IKDZ3uS0cQAwfCRolcvpl96obMiei+mX3qgsyLRe7o4A1pXewYHoE8K9XqgTwQK4JF6Hx8f5g9X8JNnTixGLXsfHx/mD1/wgoNne5LRxADB8JGiVy+mX3qhsyJ6L6ZfeqCzItF7ujgDWld7BgegTwr1eqBPBArgkXofHx/mD1fwk2dOLEYtex8fH+YPX/CCg2d7ktHEAMHwkaJXL6ZfeqGzInovpl96oLMi0Xu6OANaV3sGB6BPCvV6oE8ECuCReh8fH+YPV/CTZ04sRi17Hx8f5g9f8IKDZ3uS0cQAwfCRolcvpl96obMiei+mX3qgsyLRe7o4A1pXewYHoE8K9XqgTwQK4JF6Hx8f5g9X8JNnTixGLXsfHx/mD1/wgoNne5LRxADB8JGiVy+mX3qhsyJ6L6ZfeqCzItF7ujgDWld7BgegTwr1eqBPBArgkXofHx/mD1fwk2dOLEYtex8fH+YPX/CCg2d7ktHEAMHwkaJXL6ZfeqGzInovpl96oLMi0Xu6OANaV3sGB6BPCvV6oE8ECuCReh8fH+YPV/CTZ04sRi17Hx8f5g9f8IKDZ3uS0cQAwfCRolcvpl96obMiei+mX3qgsyLRe7o4A1pXewYHoE8K9XqgTwQK4JF6Hx8f5g9X8JNnTixGLXsfHx/mD1/wgoNne5LRxADB8JGiVy+mX3qhsyJ6L6ZfeqCzItF7ujgDWld7BgegTwr1eqBPBArgkXofHx/mD1fwk2dOLEYtex8fH+YPX/CCg2d7ktHEAMHwkaJXL6ZfeqGzInovpl96oLMi0Xu6OANaV3sGB6BPCvV6oE8ECuCReh8fH+YPV/CTZ04sRi17Hx8f5g9f8IKDZ3uS0cQAwfCRolcvpl96obMiei+mX3qgsyLRe7o4A1pXewYHoE8K9XqgTwQK4JF6Hx8f5g9X8JNnTixGLXsfHx/mD1/wgoNne5LRxADB8JGiVy+mX3qhsyJ6L6ZfeqCzItF7ujgDWld7BgegTwr1eqBPBArgkXofHx/mD1fwk2dOLEYtex8fH+YPX/CCg2d7ktHEAMHwkaJXL6ZfeqGzInovpl96oLMi0Xu6OANaV3sGB6BPCvV6oE8ECuCReh8fH+YPV/CTZ04sRi17Hx8f5g9f8IKDZ3uS0cQAwfCRolcvpl96obMiei+mX3qgsyLRe7o4A1pXewYHoE8K9XqgTwQK4JF6Hx8f5g9X8JNnTixGLXsfHx/mD1/wgoNne5LRxADB8JGiVy+mX3qhsyJ6L6ZfeqCzItF7ujgDWld7BgegTwr1eqBPBArgkXofHx/mD1fwk2dOLEYtex8fH+YPX/CCg2d7ktHEAMHwkaJXL6ZfeqGzInovpl96oLMi0Xu6OANaV3sGB6BPCvV6oE8ECuCReh8fH+YPV/CTZ04sRi17Hx8f5g9f8IKDZ3uS0cQAwfCRolcvpl96obMiei+mX3qgsyLRe7o4A1pXewYHoE8K9XqgTwQK4JF6Hx8f5g9X8JNnTixGLXsfHx/mD1/wgoNne5LRxADB8JGiVy+mX3qhsyJ6L6ZfeqCzItF7ujgDWld7BgegTwr1eqBPBArgkXofHx/mD1fwk2dOLEYtex8fH+YPX/CCg2d7ktHEAMHwkaJXL6ZfeqGzInovpl96oLMi0Xu6OANaV3sGB6BPCvV6oE8ECuCReh8fH+YPV/CTZ04sRi17Hx8f5g9f8IKDZ3uS0cQAwfCRolcvpl96obMiei+mX3qgsyLRe7o4A1pXewYHoE8K9XqgTwQK4JF6Hx8f5g9X8JNnTixGLXsfHx/mD1/wgoNne5LRxADB8JGiVy+mX3qhsyJ6L6ZfeqCzItF7ujgDWld7BgegTwr1eqBPBArgkXofHx/mD1fwk2dOLEYtex8fH+YPX/CCg2d7ktHEAMHwkaJXL6ZfeqGzInovpl96oLMi0Xu6OANaV3sGB6BPCvV6oE8ECuCReh8fH+YPV/CTZ04sRi17Hx8f5g9f8IKDZ3uS0cQAwfCRolcvpl96obMiei+mX3qgsyLRe7o4A1pXewYHoE8K9XqgTwQK4JF6Hx8f5g9X8JNnTixGLXsfHx/mD1/wgoNne5LRxADB8JGiVy+mX3qhsyJ6L6ZfeqCzItF7ujgDWld7BgegTwr1eqBPBArgkXofHx/mD1fwk2dOLEYtex8fH+YPX/CCg2d7ktHEAMHwkaJXL6ZfeqGzInovpl96oLMi0Xu6OANaV3sGB6BPCvV6oE8ECuCReh8fH+YPV/CTZ04sRi17Hx8f5g9f8IKDZ3uS0cQAwfCRolcvpl96obMiei+mX3qgsyLRe7o4A1pXewYHoE8K9XqgTwQK4JF6Hx8f5g9X8JNnTixGLXsfHx/mD1/wgoNne5LRxADB8JGiVy+mX3qhsyJ6L6ZfeqCzItF7ujgDWld7BgegTwr1eqBPBArgkXofHx/mD1fwk2dOLEYtex8fH+YPX/CCg2d7ktHEAMHwkaJXL6ZfeqGzInovpl96oLMi0Xu6OANaV3sGB6BPCvV6oE8ECuCReh8fH+YPV/CTZ04sRi17Hx8f5g9f8IKDZ3uS0cQAwfCRolcvpl96obMiei+mX3qgsyLRe7o4A1pXewYHoE8K9XqgTwQK4JF6Hx8f5g9X8JNnTixGLXsfHx/mD1/wgoNne5LRxADB8JGiVy+mX3qhsyJ6L6ZfeqCzItF7ujgDWld7BgegTwr1eqBPBArgkXofHx/mD1fwk2dOLEYtex8fH+YPX/CCg2d7ktHEAMHwkaJXL6ZfeqGzInovpl96oLMi0Xu6OANaV3sGB6BPCvV6oE8ECuCReh8fH+YPV/CTZ04sRi17Hx8f5g9f8IKDZ3uS0cQAwfCRolcvpl96obMiei+mX3qgsyLRe7o4A1pXewYHoE8K9XqgTwQK4JF6Hx8f5g9X8JNnTixGLXsfHx/mD1/wgoNne5LRxADB8JGiVy+mX3qhsyJ6L6ZfeqCzItF7ujgDWld7BgegTwr1eqBPBArgkXofHx/mD1fwk2dOLEYtex8fH+YPX/CCg2d7ktHEAMHwkaJXL6ZfeqGzInovpl96oLMi0Xu6OANaV3sGB6BPCvV6oE8ECuCReh8fH+YPV/CTZ04sRi17Hx8f5g9f8IKDZ3uS0cQAwfCRolcvpl96obMiei+mX3qgsyLRe7o4A1pXewYHoE8K9XqgTwQK4JF6Hx8f5g9X8JNnTixGLXsfHx/mD1/wgoNne5LRxADB8JGiVy+mX3qhsyJ6L6ZfeqCzItF7ujgDWld7BgegTwr1eqBPBArgkXofHx/mD1fwk2dOLEYtex8fH+YPX/CCg2d7ktHEAMHwkaJXL6ZfeqGzInovpl96oLMi0Xu6OANaV3sGB6BPCvV6oE8ECuCReh8fH+YPV/CTZ04sRi17Hx8f5g9f8IKDZ3uS0cQAwfCRolcvpl96obMiei+mX3qgsyLRe7o4A1pXewYHoE8K9XqgTwQK4JF6Hx8f5g9X8JNnTixGLXsfHx/mD1/wgoNne5LRxADB8JGiVy+mX3qhsyJ6L6ZfeqCzItF7ujgDWld7BgegTwr1eqBPBArgkXofHx/mD1fwk2dOLEYtex8fH+YPX/CCg2d7ktHEAMHwkaJXL6ZfeqGzInovpl96oLMi0Xu6OANaV3sGB6BPCvV6oE8ECuCReh8fH+YPV/CTZ04sRi17Hx8f5g9f8IKDZ3uS0cQAwfCRolcvpl96obMiei+mX3qgsyLRe7o4A1pXewYHoE8K9XqgTwQK4JF6Hx8f5g9X8JNnTixGLXsfHx/mD1/wgoNne5LRxADB8JGiVy+mX3qhsyJ6L6ZfeqCzItF7ujgDWld7BgegTwr1eqBPBArgkXofHx/mD1fwk2dOLEYtex8fH+YPX/CCg2d7ktHEAMHwkaJXL6ZfeqGzInovpl96oLMi0Xu6OANaV3sGB6BPCvV6oE8ECuCReh8fH+YPV/CTZ04sRi17Hx8f5g9f8IKDZ3uS0cQAwfCRolcvpl96obMiei+mX3qgsyLRe7o4A1pXewYHoE8K9XqgTwQK4JF6Hx8f5g9X8JNnTixGLXsfHx/mD1/wgoNne5LRxADB8JGiVy+mX3qhsyJ6L6ZfeqCzItF7ujgDWld7BgegTwr1eqBPBArgkXofHx/mD1fwk2dOLEYtex8fH+YPX/CCg2d7ktHEAMHwkaJXL6ZfeqGzInovpl96oLMi0Xu6OANaV3sGB6BPCvV6oE8ECuCReh8fH+YPV/CTZ04sRi17Hx8f5g9f8IKDZ3uS0cQAwfCRolcvpl96obMiei+mX3qgsyLRe7o4A1pXewYHoE8K9XqgTwQK4JF6Hx8f5g9X8JNnTixGLXsfHx/mD1/wgoNne5LRxADB8JGiVy+mX3qhsyJ6L6ZfeqCzItF7ujgDWld7BgegTwr1eqBPBArgkXofHx/mD1fwk2dOLEYtex8fH+YPX/CCg2d7ktHEAMHwkaJXL6ZfeqGzInovpl96oLMi0Xu6OANaV3sGB6BPCvV6oE8ECuCReh8fH+YPV/CTZ04sRi17Hx8f5g9f8IKDZ3uS0cQAwfCRolcvpl96obMiei+mX3qgsyLRe7o4A1pXewYHoE8K9XqgTwQK4JF6Hx8f5g9X8JNnTixGLXsfHx/mD1/wgoNne5LRxADB8JGiVy+mX3qhsyJ6L6ZfeqCzItF7ujgDWld7BgegTwr1eqBPBArgkXofHx/mD1fwk2dOLEYtex8fH+YPX/CCg2d7ktHEAMHwkaJXL6ZfeqGzInovpl96oLMi0Xu6OANaV3sGB6BPCvV6oE8ECuCReh8fH+YPV/CTZ04sRi17Hx8f5g9f8IKDZ3uS0cQAwfCRolcvpl96obMiei+mX3qgsyLRe7o4A1pXewYHoE8K9XqgTwQK4JF6Hx8f5g9X8JNnTixGLXsfHx/mD1/wgoNne5LRxADB8JGiVy+mX3qhsyJ6L6ZfeqCzItF7ujgDWld7BgegTwr1eqBPBArgkXofHx/mD1fwk2dOLEYtex8fH+YPX/CCg2d7ktHEAMHwkaJXL6ZfeqGzInovpl96oLMi0Xu6OANaV3sGB6BPCvV6oE8ECuCReh8fH+YPV/CTZ04sRi17Hx8f5g9f8IKDZ3uS0cQAwfCRolcvpl96obMiei+mX3qgsyLRe7o4A1pXewYHoE8K9XqgTwQK4JF6Hx8f5g9X8JNnTixGLXsfHx/mD1/wgoNne5LRxADB8JGiVy+mX3qhsyJ6L6ZfeqCzItF7ujgDWld7BgegTwr1eqBPBArgkXofHx/mD1fwk2dOLEYtex8fH+YPX/CCg2d7ktHEAMHwkaJXL6ZfeqGzInovpl96oLMi0Xu6OANaV3sGB6BPCvV6oE8ECuCReh8fH+YPV/CTZ04sRi17Hx8f5g9f8IKDZ3uS0cQAwfCRolcvpl96obMiei+mX3qgsyLRe7o4A1pXewYHoE8K9XqgTwQK4JF6Hx8f5g9X8JNnTixGLXsfHx/mD1/wgoNne5LRxADB8JGiVy+mX3qhsyJ6L6ZfeqCzItF7ujgDWld7BgegTwr1eqBPBArgkXofHx/mD1fwk2dOLEYtex8fH+YPX/CCg2d7ktHEAMHwkaJXL6ZfeqGzInovpl96oLMi0Xu6OANaV3sGB6BPCvV6oE8ECuCReh8fH+YPV/CTZ04sRi17Hx8f5g9f8IKDZ3uS0cQAwfCRolcvpl96obMiei+mX3qgsyLRe7o4A1pXewYHoE8K9XqgTwQK4JF6Hx8f5g9X8JNnTixGLXsfHx/mD1/wgoNne5LRxADB8JGiVy+mX3qhsyJ6L6ZfeqCzItF7ujgDWld7BgegTwr1eqBPBArgkXofHx/mD1fwk2dOLEYtex8fH+YPX/CCg2d7ktHEAMHwkaJXL6ZfeqGzInovpl96oLMi0Xu6OANaV3sGB6BPCvV6oE8ECuCReh8fH+YPV/CTZ04sRi17Hx8f5g9f8IKDZ3uS0cQAwfCRolcvpl96obMiei+mX3qgsyLRe7o4A1pXewYHoE8K9XqgTwQK4JF6Hx8f5g9X8JNnTixGLXsfHx/mD1/wgoNne5LRxADB8JGiVy+mX3qhsyJ6L6ZfeqCzItF7ujgDWld7BgegTwr1eqBPBArgkXofHx/mD1fwk2dOLEYtex8fH+YPX/CCg2d7ktHEAMHwkaJXL6ZfeqGzInovpl96oLMi0Xu6OANaV3sGB6BPCvV6oE8ECuCReh8fH+YPV/CTZ04sRi17Hx8f5g9f8IKDZ3uS0cQAwfCRolcvpl96obMiei+mX3qgsyLRe7o4A1pXewYHoE8K9XqgTwQK4JF6Hx8f5g9X8JNnTixGLXsfHx/mD1/wgoNne5LRxADB8JGiVy+mX3qhsyJ6L6ZfeqCzItF7ujgDWld7BgegTwr1eqBPBArgkXofHx/mD1fwk2dOLEYtex8fH+YPX/CCg2d7ktHEAMHwkaJXL6ZfeqGzInovpl96oLMi0Xu6OANaV3sGB6BPCvV6oE8ECuCReh8fH+YPV/CTZ04sRi17Hx8f5g9f8IKDZ3uS0cQAwfCRolcvpl96obMiei+mX3qgsyLRe7o4A1pXewYHoE8K9XqgTwQK4JF6Hx8f5g9X8JNnTixGLXsfHx/mD1/wgoNne5LRxADB8JGiVy+mX3qhsyJ6L6ZfeqCzItF7ujgDWld7BgegTwr1eqBPBArgkXofHx/mD1fwk2dOLEYtex8fH+YPX/CCg2d7ktHEAMHwkaJXL6ZfeqGzInovpl96oLMi0Xu6OANaV3sGB6BPCvV6oE8ECuCReh8fH+YPV/CTZ04sRi17Hx8f5g9f8IKDZ3uS0cQAwfCRolcvpl96obMiei+mX3qgsyLRe7o4A1pXewYHoE8K9XqgTwQK4JF6Hx8f5g9X8JNnTixGLXsfHx/mD1/wgoNne5LRxADB8JGiVy+mX3qhsyJ6L6ZfeqCzItF7ujgDWld7BgegTwr1eqBPBArgkXofHx/mD1fwk2dOLEYtex8fH+YPX/CCg2d7ktHEAMHwkaJXL6ZfeqGzInovpl96oLMi0Xu6OANaV3sGB6BPCvV6oE8ECuCReh8fH+YPV/CTZ04sRi17Hx8f5g9f8IKDZ3uS0cQAwfCRolcvpl96obMiei+mX3qgsyLRe7o4A1pXewYHoE8K9XqgTwQK4JF6Hx8f5g9X8JNnTixGLXsfHx/mD1/wgoNne5LRxADB8JGiVy+mX3qhsyJ6L6ZfeqCzItF7ujgDWld7BgegTwr1eqBPBArgkXofHx/mD1fwk2dOLEYtex8fH+YPX/CCg2d7ktHEAMHwkaJXL6ZfeqGzInovpl96oLMi0Xu6OANaV3sGB6BPCvV6oE8ECuCReh8fH+YPV/CTZ04sRi17Hx8f5g9f8IKDZ3uS0cQAwfCRolcvpl96obMiei+mX3qgsyLRe7o4A1pXewYHoE8K9XqgTwQK4JF6Hx8f5g9X8JNnTixGLXsfHx/mD1/wgoNne5LRxADB8JGiVy+mX3qhsyJ6L6ZfeqCzItF7ujgDWld7BgegTwr1eqBPBArgkXofHx/mD1fwk2dOLEYtex8fH+YPX/CCg2d7ktHEAMHwkaJXL6ZfeqGzInovpl96oLMi0Xu6OANaV3sGB6BPCvV6oE8ECuCReh8fH+YPV/CTZ04sRi17Hx8f5g9f8IKDZ3uS0cQAwfCRolcvpl96obMiei+mX3qgsyLRe7o4A1pXewYHoE8K9XqgTwQK4JF6Hx8f5g9X8JNnTixGLXsfHx/mD1/wgoNne5LRxADB8JGiVy+mX3qhsyJ6L6ZfeqCzItF7ujgDWld7BgegTwr1eqBPBArgkXofHx/mD1fwk2dOLEYtex8fH+YPX/CCg2d7ktHEAMHwkaJXL6ZfeqGzInovpl96oLMi0Xu6OANaV3sGB6BPCvV6oE8ECuCReh8fH+YPV/CTZ04sRi17Hx8f5g9f8IKDZ3uS0cQAwfCRolcvpl96obMiei+mX3qgsyLRe7o4A1pXewYHoE8K9XqgTwQK4JF6Hx8f5g9X8JNnTixGLXsfHx/mD1/wgoNne5LRxADB8JGiVy+mX3qhsyJ6L6ZfeqCzItF7ujgDWld7BgegTwr1eqBPBArgkXofHx/mD1fwk2dOLEYtex8fH+YPX/CCg2d7ktHEAMHwkaJXL6ZfeqGzInovpl96oLMi0Xu6OANaV3sGB6BPCvV6oE8ECuCReh8fH+YPV/CTZ04sRi17Hx8f5g9f8IKDZ3uS0cQAwfCRolcvpl96obMiei+mX3qgsyLRe7o4A1pXewYHoE8K9XqgTwQK4JF6Hx8f5g9X8JNnTixGLXsfHx/mD1/wgoNne5LRxADB8JGiVy+mX3qhsyJ6L6ZfeqCzItF7ujgDWld7BgegTwr1eqBPBArgkXofHx/mD1fwk2dOLEYtex8fH+YPX/CCg2d7ktHEAMHwkaJXL6ZfeqGzInovpl96oLMi0Xu6OANaV3sGB6BPCvV6oE8ECuCReh8fH+YPV/CTZ04sRi17Hx8f5g9f8IKDZ3uS0cQAwfCRolcvpl96obMiei+mX3qgsyLRe7o4A1pXewYHoE8K9XqgTwQK4JF6Hx8f5g9X8JNnTixGLXsfHx/mD1/wgoNne5LRxADB8JGiVy+mX3qhsyJ6L6ZfeqCzItF7ujgDWld7BgegTwr1eqBPBArgkXofHx/mD1fwk2dOLEYtex8fH+YPX/CCg2d7ktHEAMHwkaJXL6ZfeqGzInovpl96oLMi0Xu6OANaV3sGB6BPCvV6oE8ECuCReh8fH+YPV/CTZ04sRi17Hx8f5g9f8IKDZ3uS0cQAwfCRolcvpl96obMiei+mX3qgsyLRe7o4A1pXewYHoE8K9XqgTwQK4JF6Hx8f5g9X8JNnTixGLXsfHx/mD1/wgoNne5LRxADB8JGiVy+mX3qhsyJ6L6ZfeqCzItF7ujgDWld7BgegTwr1eqBPBArgkXofHx/mD1fwk2dOLEYtex8fH+YPX/CCg2d7ktHEAMHwkaJXL6ZfeqGzInovpl96oLMi0Xu6OANaV3sGB6BPCvV6oE8ECuCReh8fH+YPV/CTZ04sRi17Hx8f5g9f8IKDZ3uS0cQAwfCRolcvpl96obMiei+mX3qgsyLRe7o4A1pXewYHoE8K9XqgTwQK4JF6Hx8f5g9X8JNnTixGLXsfHx/mD1/wgoNne5LRxADB8JGiVy+mX3qhsyJ6L6ZfeqCzItF7ujgDWld7BgegTwr1eqBPBArgkXofHx/mD1fwk2dOLEYtex8fH+YPX/CCg2d7ktHEAMHwkaJXL6ZfeqGzInovpl96oLMi0Xu6OANaV3sGB6BPCvV6oE8ECuCReh8fH+YPV/CTZ04sRi17Hx8f5g9f8IKDZ3uS0cQAwfCRolcvpl96obMiei+mX3qgsyLRe7o4A1pXewYHoE8K9XqgTwQK4JF6Hx8f5g9X8JNnTixGLXsfHx/mD1/wgoNne5LRxADB8JGiVy+mX3qhsyJ6L6ZfeqCzItF7ujgDWld7BgegTwr1eqBPBArgkXofHx/mD1fwk2dOLEYtex8fH+YPX/CCg2d7ktHEAMHwkaJXL6ZfeqGzInovpl96oLMi0Xu6OANaV3sGB6BPCvV6oE8ECuCReh8fH+YPV/CTZ04sRi17Hx8f5g9f8IKDZ3uS0cQAwfCRolcvpl96obMiei+mX3qgsyLRe7o4A1pXewYHoE8K9XqgTwQK4JF6Hx8f5g9X8JNnTixGLXsfHx/mD1/wgoNne5LRxADB8JGiVy+mX3qhsyJ6L6ZfeqCzItF7ujgDWld7BgegTwr1eqBPBArgkXofHx/mD1fwk2dOLEYtex8fH+YPX/CCg2d7ktHEAMHwkaJXL6ZfeqGzInovpl96oLMi0Xu6OANaV3sGB6BPCvV6oE8ECuCReh8fH+YPV/CTZ04sRi17Hx8f5g9f8IKDZ3uS0cQAwfCRolcvpl96obMiei+mX3qgsyLRe7o4A1pXewYHoE8K9XqgTwQK4JF6Hx8f5g9X8JNnTixGLXsfHx/mD1/wgoNne5LRxADB8JGiVy+mX3qhsyJ6L6ZfeqCzItF7ujgDWld7BgegTwr1eqBPBArgkXofHx/mD1fwk2dOLEYtex8fH+YPX/CCg2d7ktHEAMHwkaJXL6ZfeqGzInovpl96oLMi0Xu6OANaV3sGB6BPCvV6oE8ECuCReh8fH+YPV/CTZ04sRi17Hx8f5g9f8IKDZ3uS0cQAwfCRolcvpl96obMiei+mX3qgsyLRe7o4A1pXewYHoE8K9XqgTwQK4JF6Hx8f5g9X8JNnTixGLXsfHx/mD1/wgoNne5LRxADB8JGiVy+mX3qhsyJ6L6ZfeqCzItF7ujgDWld7BgegTwr1eqBPBArgkXofHx/mD1fwk2dOLEYtex8fH+YPX/CCg2d7ktHEAMHwkaJXL6ZfeqGzInovpl96oLMi0Xu6OANaV3sGB6BPCvV6oE8ECuCReh8fH+YPV/CTZ04sRi17Hx8f5g9f8IKDZ3uS0cQAwfCRolcvpl96obMiei+mX3qgsyIxDsrh+eEWwxgNIf3Er+oLyuoMyiwsLPCPPcjgj14sGrcqKPDGeeCT+g3Ktygm+gvKPP4DIAI+AeoLyiAH+gzKPOoMyvoMyl8WyvCT1nkSe8bH4JMqTypHKuUmxl+Hh4M8PG8qX1Z5h4eBPDxveE4sh4eARjw8bypmb3y6OAViV31rX3y4OAVgR31pT3q4OAVQR3tZT3iU4JR8h+CV5dXFr+CSzUpifeCS0eHVzUpi0eE+AeCSzUpi8JRfPniTZy5Hr8sdMAGEH8sdMAGEH8sdMAGEH8sdMAGEH8sdMAGEH8sdMAGEH8sdMAGEH8sdMAGEH8sdxkBnCA7KMQDC5fCVb8l7vTBVfZNPepRfkTAkV3nLPy88Rz5/kU3Fh09vJgBEKSkJAfdiCcHlJsLwkm94BoDJeUtfkVd5yz8vPEc+d5FNxYdPbyYARCkpCQH4ZwnB5SbC8JJveAaAyZVPepRfkTAkV3nLPy88Rz5/kU3Fh09vJgBEKSkJAalsCcHlJsLwkm94BoDJeUtfkVd5yz8vPEc+d5FNxYdPbyYARCkpCQGqcQnB5SbC8JJveAaAyYO4MAWTgnEsLA2DuDAFk4JxLCwNg7gwBZOCcSwsDYO4MAWTgnEsLA2DuDAFk4JxLCwNg7gwBZOCcSwsDYO4MAWTgnEsLA2DuDAFk4JxLCwNg7gwBZOCcSwsDYO4MAWTgnEsLA2DuDAFk4JxLCwNg7gwBZOCcSwsDYO4MAWTgnEsLA2DuDAFk4JxLCwNg7gwBZOCcSwsDYO4MAWTgnEsLA2DuDAFk4JxLCwNg7gwBZOCcSwsDYO4MAWTgnEsLA2DuDAFk4JxLCwNg7gwBZOCcSwsDYO4MAWTgnEsLA2DuDAFk4JxLCwNg7gwBZOCcSwsDYO4MAWTgnEsLA2DuDAFk4JxLCwNg7gwBZOCcSwsDYO4MAWTgnEsLA2DuDAFk4JxLCwNg7gwBZOCcSwsDYO4MAWTgnEsLA2DuDAFk4JxLCwNg7gwBZOCcSwsDYO4MAWTgnEsLA2DuDAFk4JxLCwNg7gwBZOCcSwsDYO4MAWTgnEsLA2DuDAFk4JxLCwNg7gwBZOCcSwsDYO4MAWTgnEsLA2DuDAFk4JxLCwNg7gwBZOCcSwsDYO4MAWTgnEsLA2DuDAFk4JxLCwNg7gwBZOCcSwsDYO4MAWTgnEsLA2DuDAFk4JxLCwNg7gwBZOCcSwsDYO4MAWTgnEsLA2DuDAFk4JxLCwNg7gwBZOCcSwsDYO4MAWTgnEsLA2DuDAFk4JxLCwNg7gwBZOCcSwsDYO4MAWTgnEsLA2DuDAFk4JxLCwNg7gwBZOCcSwsDYO4MAWTgnEsLA2DuDAFk4JxLCwNg7gwBZOCcSwsDYO4MAWTgnEsLA2DuDAFk4JxLCwNg7gwBZOCcSwsDYO4MAWTgnEsLA2DuDAFk4JxLCwNg7gwBZOCcSwsDYO4MAWTgnEsLA2DuDAFk4JxLCwNg7gwBZOCcSwsDYO4MAWTgnEsLA2DuDAFk4JxLCwNg7gwBZOCcSwsDYO4MAWTgnEsLA2DuDAFk4JxLCwNg7gwBZOCcSwsDYO4MAWTgnEsLA2DuDAFk4JxLCwNg7gwBZOCcSwsDYO4MAWTgnEsLA2DuDAFk4JxLCwNg7gwBZOCcSwsDYO4MAWTgnEsLA2DuDAFk4JxLCwNg7gwBZOCcSwsDYO4MAWTgnEsLA2DuDAFk4JxLCwNg7gwBZOCcSwsDYO4MAWTgnEsLA2DuDAFk4JxLCwNg7gwBZOCcSwsDYO4MAWTgnEsLA2DuDAFk4JxLCwNg7gwBZOCcSwsDYO4MAWTgnEsLA2DuDAFk4JxLCwNg7gwBZOCcSwsDYO4MAWTgnEsLA2DuDAFk4JxLCwNg7gwBZOCcSwsDYO4MAWTgnEsLA2DuDAFk4JxLCwNg7gwBZOCcSwsDYO4MAWTgnEsLA2DuDAFk4JxLCwNg7gwBZOCcSwsDYO4MAWTgnEsLA2DuDAFk4JxLCwNg7gwBZOCcSwsDYO4MAWTgnEsLA2DuDAFk4JxLCwNg7gwBZOCcSwsDYO4MAWTgnEsLA2DuDAFk4JxLCwNg7gwBZOCcSwsDYO4MAWTgnEsLA2DuDAFk4JxLCwNg7gwBZOCcSwsDYO4MAWTgnEsLA2DuDAFk4JxLCwNg7gwBZOCcSwsDYO4MAWTgnEsLA2DuDAFk4JxLCwNg7gwBZOCcSwsDYO4MAWTgnEsLA2DuDAFk4JxLCwNg7gwBZOCcSwsDYO4MAWTgnEsLA2DuDAFk4JxLCwNyXEsLIO4MAOTgg1xLCyDuDADk4INcSwsg7gwA5OCDXEsLIO4MAOTgg1xLCyDuDADk4INcSwsg7gwA5OCDXEsLIO4MAOTgg1xLCyDuDADk4INcSwsg7gwA5OCDXEsLIO4MAOTgg1xLCyDuDADk4INcSwsg7gwA5OCDXEsLIO4MAOTgg1xLCyDuDADk4INcSwsg7gwA5OCDXEsLIO4MAOTgg1xLCyDuDADk4INcSwsg7gwA5OCDXEsLIO4MAOTgg1xLCyDuDADk4INcSwsg7gwA5OCDXEsLIO4MAOTgg1xLCyDuDADk4INcSwsg7gwA5OCDXEsLIO4MAOTgg1xLCyDuDADk4INcSwsg7gwA5OCDXEsLIO4MAOTgg1xLCyDuDADk4INcSwsg7gwA5OCDXEsLIO4MAOTgg1xLCyDuDADk4INcSwsg7gwA5OCDXEsLIO4MAOTgg1xLCyDuDADk4INcSwsg7gwA5OCDXEsLIO4MAOTgg1xLCyDuDADk4INcSwsg7gwA5OCDXEsLIO4MAOTgg1xLCyDuDADk4INcSwsg7gwA5OCDXEsLIO4MAOTgg1xLCyDuDADk4INcSwsg7gwA5OCDXEsLIO4MAOTgg1xLCyDuDADk4INcSwsg7gwA5OCDXEsLIO4MAOTgg1xLCyDuDADk4INcSwsg7gwA5OCDXEsLIO4MAOTgg1xLCyDuDADk4INcSwsg7gwA5OCDXEsLIO4MAOTgg1xLCyDuDADk4INcSwsg7gwA5OCDXEsLIO4MAOTgg1xLCyDuDADk4INcSwsg7gwA5OCDXEsLIO4MAOTgg1xLCyDuDADk4INcSwsg7gwA5OCDXEsLIO4MAOTgg1xLCyDuDADk4INcSwsg7gwA5OCDXEsLIO4MAOTgg1xLCyDuDADk4INcSwsg7gwA5OCDXEsLIO4MAOTgg1xLCyDuDADk4INcSwsg7gwA5OCDXEsLIO4MAOTgg1xLCyDuDADk4INcSwsg7gwA5OCDXEsLIO4MAOTgg1xLCyDuDADk4INcSwsg7gwA5OCDXEsLIO4MAOTgg1xLCyDuDADk4INcSwsg7gwA5OCDXEsLIO4MAOTgg1xLCyDuDADk4INcSwsg7gwA5OCDXEsLIO4MAOTgg1xLCyDuDADk4INcSwsg7gwA5OCDXEsLIO4MAOTgg1xLCyDuDADk4INcSwsg7gwA5OCDXEsLIO4MAOTgg1xLCyDuDADk4INcSwsg7gwA5OCDXEsLIO4MAOTgg1xLCyDuDADk4INcSwsg7gwA5OCDXEsLIO4MAOTgg1xLCyDuDADk4INcSwsg7gwA5OCDXEsLIO4MAOTgg1xLCyDuDADk4INcSwsg7gwA5OCDXEsLIO4MAOTgg1xLCyDuDADk4INcSwsg7gwA5OCDXEsLIO4MAOTgg1xLCyDuDADk4INcSwsg7gwA5OCDXEsLIO4MAOTgg1xLCyDuDADk4INcSwsg7gwA5OCDXEsLIO4MAOTgg1xLCyDuDADk4INcSwsg7gwA5OCDXEsLIO4MAOTgg1xLCyDuDADk4INcSwsg7gwA5OCDXEsLIO4MAOTgg1xLCyDuDADk4INcSwsg7gwA5OCDcmDuDAFk4JxLCwMg7gwBZOCcSwsDIO4MAWTgnEsLAyDuDAFk4JxLCwMg7gwBZOCcSwsDIO4MAWTgnEsLAyDuDAFk4JxLCwMg7gwBZOCcSwsDIO4MAWTgnEsLAyDuDAFk4JxLCwMg7gwBZOCcSwsDIO4MAWTgnEsLAyDuDAFk4JxLCwMg7gwBZOCcSwsDIO4MAWTgnEsLAyDuDAFk4JxLCwMg7gwBZOCcSwsDIO4MAWTgnEsLAyDuDAFk4JxLCwMg7gwBZOCcSwsDIO4MAWTgnEsLAyDuDAFk4JxLCwMg7gwBZOCcSwsDIO4MAWTgnEsLAyDuDAFk4JxLCwMg7gwBZOCcSwsDIO4MAWTgnEsLAyDuDAFk4JxLCwMg7gwBZOCcSwsDIO4MAWTgnEsLAyDuDAFk4JxLCwMg7gwBZOCcSwsDIO4MAWTgnEsLAyDuDAFk4JxLCwMg7gwBZOCcSwsDIO4MAWTgnEsLAyDuDAFk4JxLCwMg7gwBZOCcSwsDIO4MAWTgnEsLAyDuDAFk4JxLCwMg7gwBZOCcSwsDIO4MAWTgnEsLAyDuDAFk4JxLCwMg7gwBZOCcSwsDIO4MAWTgnEsLAyDuDAFk4JxLCwMg7gwBZOCcSwsDIO4MAWTgnEsLAyDuDAFk4JxLCwMg7gwBZOCcSwsDIO4MAWTgnEsLAyDuDAFk4JxLCwMg7gwBZOCcSwsDIO4MAWTgnEsLAyDuDAFk4JxLCwMg7gwBZOCcSwsDIO4MAWTgnEsLAyDuDAFk4JxLCwMg7gwBZOCcSwsDIO4MAWTgnEsLAyDuDAFk4JxLCwMg7gwBZOCcSwsDIO4MAWTgnEsLAyDuDAFk4JxLCwMg7gwBZOCcSwsDIO4MAWTgnEsLAyDuDAFk4JxLCwMg7gwBZOCcSwsDIO4MAWTgnEsLAyDuDAFk4JxLCwMg7gwBZOCcSwsDIO4MAWTgnEsLAyDuDAFk4JxLCwMg7gwBZOCcSwsDIO4MAWTgnEsLAyDuDAFk4JxLCwMg7gwBZOCcSwsDIO4MAWTgnEsLAyDuDAFk4JxLCwMg7gwBZOCcSwsDIO4MAWTgnEsLAyDuDAFk4JxLCwMg7gwBZOCcSwsDIO4MAWTgnEsLAyDuDAFk4JxLCwMg7gwBZOCcSwsDIO4MAWTgnEsLAyDuDAFk4JxLCwMg7gwBZOCcSwsDIO4MAWTgnEsLAyDuDAFk4JxLCwMg7gwBZOCcSwsDIO4MAWTgnEsLAyDuDAFk4JxLCwMg7gwBZOCcSwsDIO4MAWTgnEsLAyDuDAFk4JxLCwMg7gwBZOCcSwsDIO4MAWTgnEsLAyDuDAFk4JxLCwMg7gwBZOCcSwsDIO4MAWTgnEsLAyDuDAFk4JxLCwMg7gwBZOCcSwsDIO4MAWTgnEsLAyDuDAFk4JxLCwMg7gwBZOCcSwsDIO4MAWTgnEsLAyDuDAFk4JxLCwMg7gwBZOCcSwsDIO4MAWTgnEsLAyDuDAFk4JxLCwMg7gwBZOCcSwsDIO4MAWTgnEsLAyDuDAFk4JxLCwMg7gwBZOCcSwsDIO4MAWTgnEsLAyDuDAFk4JxLCwMg7gwBZOCcSwsDIO4MAWTgnEsLAyDuDAFk4JxLCwMg7gwBZOCcSwsDIO4MAWTgnEsLAyDuDAFk4JxLCwMg7gwBZOCcSwsDIO4MAWTgnEsLAyDuDAFk4JxLCwMg7gwBZOCcSwsDMlxLCyDuDADk4IMcSwsg7gwA5OCDHEsLIO4MAOTggxxLCyDuDADk4IMcSwsg7gwA5OCDHEsLIO4MAOTggxxLCyDuDADk4IMcSwsg7gwA5OCDHEsLIO4MAOTggxxLCyDuDADk4IMcSwsg7gwA5OCDHEsLIO4MAOTggxxLCyDuDADk4IMcSwsg7gwA5OCDHEsLIO4MAOTggxxLCyDuDADk4IMcSwsg7gwA5OCDHEsLIO4MAOTggxxLCyDuDADk4IMcSwsg7gwA5OCDHEsLIO4MAOTggxxLCyDuDADk4IMcSwsg7gwA5OCDHEsLIO4MAOTggxxLCyDuDADk4IMcSwsg7gwA5OCDHEsLIO4MAOTggxxLCyDuDADk4IMcSwsg7gwA5OCDHEsLIO4MAOTggxxLCyDuDADk4IMcSwsg7gwA5OCDHEsLIO4MAOTggxxLCyDuDADk4IMcSwsg7gwA5OCDHEsLIO4MAOTggxxLCyDuDADk4IMcSwsg7gwA5OCDHEsLIO4MAOTggxxLCyDuDADk4IMcSwsg7gwA5OCDHEsLIO4MAOTggxxLCyDuDADk4IMcSwsg7gwA5OCDHEsLIO4MAOTggxxLCyDuDADk4IMcSwsg7gwA5OCDHEsLIO4MAOTggxxLCyDuDADk4IMcSwsg7gwA5OCDHEsLIO4MAOTggxxLCyDuDADk4IMcSwsg7gwA5OCDHEsLIO4MAOTggxxLCyDuDADk4IMcSwsg7gwA5OCDHEsLIO4MAOTggxxLCyDuDADk4IMcSwsg7gwA5OCDHEsLIO4MAOTggxxLCyDuDADk4IMcSwsg7gwA5OCDHEsLIO4MAOTggxxLCyDuDADk4IMcSwsg7gwA5OCDHEsLIO4MAOTggxxLCyDuDADk4IMcSwsg7gwA5OCDHEsLIO4MAOTggxxLCyDuDADk4IMcSwsg7gwA5OCDHEsLIO4MAOTggxxLCyDuDADk4IMcSwsg7gwA5OCDHEsLIO4MAOTggxxLCyDuDADk4IMcSwsg7gwA5OCDHEsLIO4MAOTggxxLCyDuDADk4IMcSwsg7gwA5OCDHEsLIO4MAOTggxxLCyDuDADk4IMcSwsg7gwA5OCDHEsLIO4MAOTggxxLCyDuDADk4IMcSwsg7gwA5OCDHEsLIO4MAOTggxxLCyDuDADk4IMcSwsg7gwA5OCDHEsLIO4MAOTggxxLCyDuDADk4IMcSwsg7gwA5OCDHEsLIO4MAOTggxxLCyDuDADk4IMcSwsg7gwA5OCDHEsLIO4MAOTggxxLCyDuDADk4IMcSwsg7gwA5OCDHEsLIO4MAOTggxxLCyDuDADk4IMcSwsg7gwA5OCDHEsLIO4MAOTggxxLCyDuDADk4IMcSwsg7gwA5OCDHEsLIO4MAOTggxxLCyDuDADk4IMcSwsg7gwA5OCDHEsLIO4MAOTggxxLCyDuDADk4IMcSwsg7gwA5OCDHEsLIO4MAOTggxxLCyDuDADk4IMcSwsg7gwA5OCDHEsLIO4MAOTggxxLCyDuDADk4IMcSwsg7gwA5OCDHEsLIO4MAOTggxxLCyDuDADk4IMcSwsg7gwA5OCDHEsLIO4MAOTggzJxg+Hh+oawXovpl96obMiei+mX3qgszIkeRgAInAtJCJwLSQicC0kInAtJCJwLSQicC0kInAtJCJwLSQicC0kInAtJCJwLSQicC0kInAtJCJwLSQW/8n///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////+qqlVVqqpVVaqqVVWqqlVVqqpVVaqqVVWqqlVVqqpVVaqqVVWqqlVVqqpVVaqqVVWqqlVVqqpVVaqqVVWqqlVVqqpVVaqqVVWqqlVVqqpVVaqqVVWqqlVVqqpVVaqqVVWqqlVVqqpVVaqqVVWqqlVVqqpVVaqqVVWqqlVVqqpVVaqqVVWqqlVVqqpVVaqqVVWqqlVVqqpVVaqqVVWqqlVVqqpVVaqqVVWqqlVVqqpVVaqqVVWqqlVVqqpVVaqqVVWqqlVVqqpVVaqqVVWqqlVVqqpVVaqqVVWqqlVVqqpVVaqqVVWqqlVVqqpVVaqqVVWqqlVVqqpVVaqqVVWqqlVVACEzDDPAABIAEjPAMwwAIQAhMwwzwAASABIzwDMMACEAITMMM8AAEgASM8AzDAAhACEzDDPAABIAEjPAMwwAIQAhMwwzwAASABIzwDMMACEAITMM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cAkicAkicAkicAkicAkicAkicAkicAksLCXLZcgkaMnJycnJ4SJwCSJwCSJwCSJwCSJwCSJwCXIscAl7InAJInAJInAJInAJInAJInAJInAJInAJInAJLCwly2XIJGjJycnJyeEicAkicAkicAkicAkicAkicAkicAlyLHAJeyJwCSJwCSJwCSJwCSJwCSJwCSJwCSJwCSwsJctlyCRoycnJycnhInAJInAJInAJInAJInAJInAJInAJInAJcixwCXsicAkicAkicAkicAkicAkicAkicAksLCXLZcgkaMnJycnJ4SJwCSJwCSJwCSJwCSJwCSJwCSJwCSJwCSJwCXIscAl7InAJInAJInAJInAJInAJInAJLCwly2XIJGjJycnJyeEicAkicAkicAkicAkicAkicAkicAkicAkicAkicAlyLHAJeyJwCSJwCSJwCSJwCSJwCSwsJctlyCRoycnJycnhInAJInAJInAJInAJInAJInAJInAJInAJInAJInAJInAJcixwCXsicAkicAkicAkicAksLCXLZcgkaMnJycnJ4SJwCSJwCSJwCSJwCSJwCSJwCSJwCSJwCSJwCSJwCSJwCSJwCXIscAl7InAJInAJInAJLCwly2XIJGjJycnJyeEicAkicAkicAkicAkicAkicAkicAkicAkicAkicAkicAkicAkicAlyLHAJeyJwCSJwCSwsJctlyCRoycnJycnhInAJInAJInAJInAJInAJInAJInAJInAJInAJInAJInAJInAJInAJInAJcixwCXsicAksLCXLZcgkaMnJycnJ4SJwCSJwCSJwCSJwCSJwCSJwCSJwCSJwCSJwCSJwCSJwCSJwCSJwCSJwCSJwCXIscAl7LCwly2XIJGjJycnJydE+t5LI4IXmB8RSRPCFHx8focjlzTJE4XkicCwicCwicCwicCwicCwicCwicCwicCzJ+ABUXWhHeZAfyx1nATNZCfCCMQCv/qAoAzEAvwH/AOlHPgeQVF1HDjOvyxkwAYAfyxkwAYAfyxkwAYAfyxkwAYAfyxkwAYAfyxkwAYAfyxkwAYAfyxkwAYAfyxlHIbRXCeViaz7/AQ8Ayfoay2/6G8uFZ/4UIAU+/y0YBtbsIAU8LOoby3zqGsvNr2AhlEbNyhDwpMagV/Cjxn9f1SGXRs3KEPCkxqBn8KPGf2/RzTEcKAsf2hhZH9oYWcPERny6OAViV31rX+XNmkbh1Xu90sxFe9ZA4Ih9k0884Il6lF/ghjzgij2RMGvgh3nLPy88g+CF8IIBDwBvVHzWQBfLN6GFZ3rmBxdvGAjwij3KAETgivCJX/CGV/CFGASCHSgLy38g+Ffwh4LghR3NYkUY2nvgifCIg1/l5gf2CG8mB1Z7aB8fHx/LHR/LHeYDxkBnrx7/6XnghpPgh3vLPy88geCF8IIBDwBvVHzWQBfLN6GFZ3rmBxdv8Ilf8IZX8IXLfyAHV/CHgh0YAYLghc1iRfCKPcoAROCKGN171kDgiHuVTzzgiXqUX+CGPOCKPZEwa+CHecs/LzyD4IXwggEPAG9UfNZAF8s3oYVneuYHF28YCPCKPcoAROCK8Ilf8IZX8IUYBIIdKAvLfyD4V/CHguCFHc0qRhjae+CJ8IiTX+XmB/YQbyYHVntoHx8fH8sdH8sd5gPGQGc+/1jpeeCGk+CHe8s/LzyB4IXwggEPAG9UfNZAF8s3oYVneuYHF2/wiV/whlfwhct/IAdX8IeCHRgBguCFzSpG8Io9ygBE4IoY3UYAALoAAHzWQMhPHx8f5h9HeeYHKAsE/gUwBvUhylblBT4PkCHJRoRn5fCCZ69vyfCCZ69vIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIsnxAQ8APcqEVz0odj0oOj0idwkidwkidwkidwkidwkidwkidwkidwkidwkidwkidwkidwkidwkidwkidwkidwksLCXLZSgCJGgidwkidwkidwkidwkidwkidwkidwkidwkidwkidwkidwkidwkidwkidwkidwkidwksLCXLZSgCJGgidwkidwkidwkidwkidwkidwkidwkidwkidwkidwkidwkidwkidwkidwkidwkidwksLCXLZSgCJGgidwkidwkidwkidwkidwkidwkidwkidwkidwkidwkidwkidwkidwkidwkidwkid8kicAkicAkicAkicAkicAkicAkicAkicAkicAkicAkicAkicAkicAkicAkicAkicAksLCUicAkicAkicAkicAkicAkicAkicAkicAkicAkicAkicAkicAkicAkicAkicAkicAksLCUicAkicAkicAkicAkicAkicAkicAkicAkicAkicAkicAkicAkicAkicAkicAkicAksLCUicAkicAkicAkicAkicAkicAkicAkicAkicAkicAkicAkicAkicAkicAkicAkicAksLCUicAkicAkicAkicAkicAkicAkicAkicAkicAkicAkicAkicAkicAkicAkicAkicAksLCUicAkicAkicAkicAkicAkicAkicAkicAkicAkicAkicAkicAkicAkicAkicAkicAksLCUicAkicAkicAkicAkicAkicAkicAkicAkicAkicAkicAkicAkicAkicAkicAkicAloyfgAVF3wgjEAr/6gKAMxAL8B/wDFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcVia/nJJgJ+4JovPOCYfcZAb37gl+Cbr+CZ4JzgneCePkDgn8n/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////Aw==';