'use client';

import { ReactNode, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';
import { LucideIcon } from 'lucide-react';
import { Eye, Edit, MoreVertical, Cpu, Database } from 'lucide-react';

interface ElegantCardProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
  iconColor?: string;
  bgColor?: string;
  value?: string | number;
  badge?: string;
  badgeColor?: string;
  children?: ReactNode;
  href?: string;
  onClick?: () => void;
  className?: string;
  // Props para ações interativas
  showActions?: boolean;
  onViewDetails?: () => void;
  onEdit?: () => void;
  actionsMenu?: ReactNode;
  // Props adicionais para informações do agente
  subtitle?: string;
  metadata?: Array<{ label: string; value: string; icon?: LucideIcon; color?: string }>;
}

export default function ElegantCard({
  title,
  description,
  icon: Icon,
  iconColor = "text-blue-600",
  bgColor = "bg-blue-100 dark:bg-blue-900/20",
  value,
  badge,
  badgeColor = "bg-blue-50 text-blue-700 border-blue-200",
  children,
  href,
  onClick,
  className = "",
  showActions = false,
  onViewDetails,
  onEdit,
  actionsMenu,
  subtitle,
  metadata
}: ElegantCardProps) {
  const CardWrapper = href && !onClick ? 'a' : 'div';
  const wrapperProps = href && !onClick 
    ? { href, onClick, className: `cursor-pointer ${className}` }
    : { onClick, className };

  const content = (
    <Card className={`group relative overflow-hidden bg-white dark:bg-slate-800 shadow-lg hover:shadow-xl transition-all duration-300 border-0 hover:scale-105 hover:-translate-y-1 ${showActions ? 'pt-2' : ''}`}>
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-transparent opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
      
      {/* Action buttons overlay */}
      {showActions && (
        <div className="absolute top-2 right-2 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="flex items-center space-x-1 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-1">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 hover:bg-blue-100 dark:hover:bg-blue-900/50 text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
                    onClick={(e) => {
                      e.stopPropagation();
                      onViewDetails?.();
                    }}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Ver detalhes do agente</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 hover:bg-green-100 dark:hover:bg-green-900/50 text-gray-600 hover:text-green-600 dark:text-gray-400 dark:hover:text-green-400"
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit?.();
                    }}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Editar agente</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            {actionsMenu}
          </div>
        </div>
      )}
      
      <CardHeader className={`flex flex-row items-center justify-between space-y-0 pb-4 relative z-10 ${showActions ? 'pr-16' : ''}`}>
        <div className="flex-1">
          <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {title}
          </CardTitle>
          {subtitle && (
            <div className="text-sm text-muted-foreground mt-1 flex items-center">
              {subtitle}
            </div>
          )}
          {description && (
            <CardDescription className="mt-1 text-gray-600 dark:text-gray-300">
              {description}
            </CardDescription>
          )}
        </div>
        {Icon && (
          <div className={`p-3 ${bgColor} rounded-xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-md`}>
            <Icon className={`w-6 h-6 ${iconColor}`} />
          </div>
        )}
      </CardHeader>
      
      <CardContent className="pt-0 relative z-10">
        {value && (
          <div className="text-3xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {value}
          </div>
        )}
        
        {badge && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              {children}
            </span>
            <Badge variant="outline" className={`${badgeColor} px-3 py-1 rounded-full text-xs font-medium shadow-sm`}>
              {badge}
            </Badge>
          </div>
        )}
        
        {!badge && children}
        
        {metadata && metadata.length > 0 && (
          <div className="mt-3 space-y-2">
            {metadata.map((item, index) => {
              const IconComponent = item.icon;
              return (
                <div key={index} className="flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2 text-muted-foreground">
                    {IconComponent && (
                      <IconComponent className={`w-3 h-3 ${item.color || 'text-gray-500'}`} />
                    )}
                    <span>{item.label}:</span>
                  </div>
                  <span className="font-medium text-foreground">{item.value}</span>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
      
      {/* Subtle border animation */}
      <div className="absolute inset-0 rounded-lg border-2 border-transparent group-hover:border-blue-200 dark:group-hover:border-blue-800 transition-all duration-300 pointer-events-none"></div>
    </Card>
  );

  if (CardWrapper === 'a') {
    return (
      <CardWrapper {...wrapperProps}>
        {content}
      </CardWrapper>
    );
  }

  return (
    <CardWrapper {...wrapperProps}>
      {content}
    </CardWrapper>
  );
}