# 数据结构

严蔚敏的数据结构+《新编数据结构习题与解析》

王道408-数据结构单科

## 约定

1. 说某个算法可以实现随机存储，那么它的时间复杂度为O(1)
2. 说某个算法可以原地工作，那么它的空间复杂度为O(1)
3. CRUD分别对应：C（create）-新增 R（read）-读取 U（update）-更新 D（delete）-删除
4. 按位插入、按值插入

## 结构

### 顺序表

1. 线性表

```c
typedef struct {
    ElementType data[MaxSize];
    int length;
} SqList;
```

2. 链表
