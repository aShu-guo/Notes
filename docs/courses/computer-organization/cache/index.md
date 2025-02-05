# 存储系统

存储金字塔结构

![img.png](/imgs/visual/3d-math/cache-tower.png)

为什么要如此设计呢？

由于集成电路的制造技术高速发展，CPU的运行速度也得到了质的提升，但是I/O设备存取速度远低于CPU，那么就需要存储系统来缓解这种矛盾。

1. 寄存器

寄存器是存储系统中最快的

:::info
为什么寄存器比内存快？

1. 寄存器靠CPU更近，信号传输距离短
2. 寄存器工作内存更简单：存+取
3. 机器运行过程中，寄存器一直有电，内存只有在使用时才会通电

:::

2. Cache

Cache（又称为高速缓存）使用的是多级存储，例如L1、L2、L3

- SRAM：静态随机访问存储，访问最新数据时`无需`刷新电路，断电时数据`消失`
- DRAM：动态随机访问存储，访问最新数据时`需`刷新电路，断电时数据`不会消失`

用存储时是否需要不断刷新电路来区分是否为动态、静态，例如：多级Cache在使用时无需频繁刷新电路就可以保持数据最新，所以它使用的是SRAM

Cache有时又称为片上缓存，

## Cache的存储结构

缓存由若干缓存块（Cache Block，或Cache Line）构成，每个缓存块存储具有连续内存地址的若干个存储单元。

每个缓存块有一个索引（Index），拼接标签值和此缓存块的索引，即可求得缓存块的内存地址。如果再加上块内偏移，就能得出任意一块数据的对应内存地址。

此外，每个缓存块还可对应若干标志位，包括有效位（valid bit）、脏位（dirty bit）、使用位（use bit）等。这些位在保证正确性、排除冲突、优化性能等方面起着重要作用。

![img.png](/imgs/visual/3d-math/cache-structure.png)
14*1+17*3+16*2+20*2
14+51+38+40
14+

## 内存与Cache映射规则

- 别名
  - Cache块内地址 --> 块内偏移
  - Cache块号 --> 位行号

### 直接映射

- 别名
  - 直接映射 --> 单路相联映射

每个主存块只能放在一个特定的位置，Cache块号 = 主存块号 % Cache块总数

```js
// 假设有8个Cache块，主存块号为39，那么39号主存映射到：39 % 8 = 6，即(6-1)号Cache块，因为索引是从0开始的
```

主存地址数量：256MB = 256*1024*1024B = 2<sup>28</sup>B

行长：64B = 2<sup>6</sup>B

Cache块总数：8 = 2<sup>3</sup>

![img.png](/imgs/visual/3d-math/cache-mapping-1.png)

总结：

- 假设Cache总块数为2<sup>n</sup>，则主存块号后n位记录数据存放在Cache的块号
- Cache块的字长与主存块的字长相同

### 组相联映射

将Cache块在内部分为多个组，例如：2块为1组，每个主存块可以存放在特定组内的任意行。Cache中的组号 = 主存块号 % Cache组数

![img.png](/imgs/visual/3d-math/cache-mapping-2.png)

总结

- 假设Cache总块数为2<sup>n</sup>，并且是k路组相联，2<sup>x</sup>=2<sup>n</sup>/k则主存块号后 x 位记录数据存放在Cache的块号
- 一个组内有几个Cache块就称为几路相联映射

### 全相联映射

内存中的数据块可以被放置到Cache的任意行

![img.png](/imgs/visual/3d-math/cache-mapping-3.png)

总结

- 索引失效，直接通过在整个缓存空间上匹配标签进行查找

<table>
    <tbody>
    <tr>
        <th></th>
        <th>全相联</th>
        <th>直接</th>
        <th>组相联</th>
    </tr>
    <tr>
        <td>特点</td>
        <td>任意位置</td>
        <td>特定位置</td>
        <td>分组中的任意位置</td>
    </tr>
    <tr>
        <td>主存地址结构</td>
        <td>标记+块内地址</td>
        <td>标记+行号+块内地址</td>
        <td>标记+组号+块内地址</td>
    </tr>
    <tr>
        <td>优点</td>
        <td>Cache存储空间利用充分</td>
        <td>对任意地址，执行对比一个Tag，速度快</td>
        <td>折中办法</td>
    </tr>
    <tr>
        <td>缺点</td>
        <td>可以会对比所有行的标记，速度慢</td>
        <td>Cache空间利用不充分</td>
        <td>/</td>
    </tr>
    </tbody>
</table>

## 置换策略

Cache块占满之后，发生缓存失效时则必须选择一个Cache替换掉。

最理想的策略是：替换掉距离下一次访问间隔最长的Cache块，称为最久未使用算法。但是这无法真正实现，可以通过以下几种替换算法：

### RAND

随机算法，Cache失效时替换任意位置。实现简单，测试表明完全随机替换的性能近似于LRU

#### 存在的问题

存在抖动现象。

### FIFO(first input first output)

以先来先服务的方式为排队区中的人们提供服务。 先进先出，替换掉最先进去的Cache块。

#### 存在的问题

没有考虑到局部性原理，最先被调入Cache块可能是被访问最频繁的。

### LFU(Least Frequently Used)

替换掉Cache块中引用次数最少的那个

#### 实现

理想中的实现：为Cache块提供一个计数器，被引用时➕1，当发生缓存失效时剔除计数最少的那个Cache块

现实中实现时：在顶层提供一个计数器统计各个Cache块的引用数量

#### 存在的问题

当出现循环引用时，引用数会急剧升高，即使缓存失效也无法有效释放Cache块

### LRU

替换掉年龄最大的Cache块

#### 实现

需要为每个Cache块保存年龄位，而且每次使用Cache时，其他Cache块的年龄也会发生变化，发生Cache失效时替换掉年龄最大的块。

#### 存在的问题

成本高昂

## 数据一致性

CPU修改了Cache块中的数据，为了保证与下级内存的数据一致性，需要适时的把更新传播下去。一般有两种回写策略：写回（Write
back）和写通（Write through）。

### 写回（Write back）

Cache块的数据发生更改时，不会立刻写入内存。而是在Cache将要被替换时才会写入内存中，减少了内存的写操作，但是会存在数据不一致的隐患。

为了进一步减少替换时的写入操作，通常会提供一个dirty bit，标记Cache是否发生过更新数据的操作。如果在置换回内存时dirty
bit为false，则无需写入内存。

### 写通（Write through）

Cache块的数据发生更改时，立刻同时写入内存。由于会存在大量的写操作，有必要设置一个缓冲来减少硬件冲突。

## 虚拟内存

计算机系统内存管理的一种技术，即把地址空间定义为“连续的虚拟内存地址”，以借此“欺骗”程序，使它们以为自己正在使用一大块的“连续”地址。

要注意的是，虚拟内存不只是`“用磁盘空间来扩展物理内存”`的意思，这只是虚拟内存技术的结果。

### 分页技术

是一种操作系统里存储器管理的一种技术，使主存可以使用存储在辅助存储器中的资料。操作系统会将`辅助存储器（通常是磁盘）`
中的资料分割成固定大小的区块，称为“页”（pages）。

当不需要时，将分页由主存（通常是内存）移到辅助存储器；

当需要时，再将资料取回，加载主存中。相对于分段，分页允许存储器存储于不连续的区块以维持文件系统的整齐。

分页是磁盘和内存间传输数据块的最小单位。

**虚拟内存和分页技术总是同时存在的。**

## 常见存储

- 闪存
- 机械硬盘
- 固态

## 练习

1. 某文件系统采用多级索引结构，若磁盘块的大小为512字节，每个块号需占3字节，那么根索引采用一级索引时的文件最大长度为（）KB；采用二级索引时的文件最大长度为（）KB

遇到计算磁盘大小的习题，首先计算`磁盘总块数`。

直接地址索引：直接存放数据块

间接地址索引：它有几个分类，一级间接地址索引、二级间接地址索引、三级间接地址索引...

计算时，直接地址索引映射一个物理块，n级间接地址索引为`n * 磁盘总块数`个物理块，再乘每个物理块的容量大小即可计算出可存储的数据大小。

答：总块数：512/3=170 一级间接地址存储容量：`170*512/1024` 一级间接地址存储容量：`170*512*512/1024`

2. 数据存储的不同排列顺序，读取和处理消耗的时间计算问题
